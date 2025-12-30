/**
 * MVP Matching Service
 * Matches user project descriptions to known MVP types from knowledge base
 */

import mvpKnowledgeBase from './mvp-knowledge-base.json';

export interface MVPMatch {
  id: string;
  name: string;
  category: string;
  confidence: number; // 0-1 score
  baselineEstimates: {
    midTier: {
      timelineMonths: string;
      costRange: string;
      hourlyRate: string;
      teamSize: number;
    };
    senior: {
      timelineMonths: string;
      costRange: string;
      hourlyRate: string;
      teamSize: number;
    };
  };
  keywords: string[];
}

/**
 * Calculate similarity score between two strings using keyword matching
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  let matches = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
        matches++;
      }
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
}

/**
 * Match project description to MVP types
 * Returns top 3 matches sorted by confidence
 * @param projectDescription - User's project description
 * @param features - List of selected features
 * @param categoryFilter - Optional array of categories to search within
 */
export function matchProjectToMVP(
  projectDescription: string,
  features: string[] = [],
  categoryFilter?: string[] | null
): MVPMatch[] {
  const searchText = `${projectDescription} ${features.join(' ')}`.toLowerCase();
  
  const matches: MVPMatch[] = [];
  
  // Filter MVP types by category if specified
  const mvpTypesToSearch = categoryFilter && categoryFilter.length > 0
    ? mvpKnowledgeBase.mvp_types.filter(mvp => categoryFilter.includes(mvp.category))
    : mvpKnowledgeBase.mvp_types;
  
  for (const mvp of mvpTypesToSearch) {
    // Calculate confidence based on keyword matches
    let confidence = 0;
    
    // Check MVP name similarity
    const nameSimilarity = calculateSimilarity(searchText, mvp.name);
    confidence += nameSimilarity * 0.4;
    
    // Check keyword matches
    for (const keyword of mvp.keywords) {
      if (searchText.includes(keyword)) {
        confidence += 0.1;
      }
    }
    
    // Check category relevance
    const categorySimilarity = calculateSimilarity(searchText, mvp.category);
    confidence += categorySimilarity * 0.2;
    
    // Normalize confidence to 0-1
    confidence = Math.min(confidence, 1.0);
    
    if (confidence > 0.1) { // Only include if there's some relevance
      matches.push({
        id: mvp.id,
        name: mvp.name,
        category: mvp.category,
        confidence,
        baselineEstimates: {
          midTier: {
            timelineMonths: mvp.baseline_estimates.mid_tier.timeline_months,
            costRange: mvp.baseline_estimates.mid_tier.cost_range,
            hourlyRate: mvp.baseline_estimates.mid_tier.hourly_rate,
            teamSize: mvp.baseline_estimates.mid_tier.team_size,
          },
          senior: {
            timelineMonths: mvp.baseline_estimates.senior.timeline_months,
            costRange: mvp.baseline_estimates.senior.cost_range,
            hourlyRate: mvp.baseline_estimates.senior.hourly_rate,
            teamSize: mvp.baseline_estimates.senior.team_size,
          },
        },
        keywords: mvp.keywords,
      });
    }
  }
  
  // Sort by confidence and return top 3
  return matches
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}

/**
 * Get specific MVP by ID
 */
export function getMVPById(id: string): MVPMatch | null {
  const mvp = mvpKnowledgeBase.mvp_types.find(m => m.id === id);
  if (!mvp) return null;
  
  return {
    id: mvp.id,
    name: mvp.name,
    category: mvp.category,
    confidence: 1.0,
    baselineEstimates: {
      midTier: {
        timelineMonths: mvp.baseline_estimates.mid_tier.timeline_months,
        costRange: mvp.baseline_estimates.mid_tier.cost_range,
        hourlyRate: mvp.baseline_estimates.mid_tier.hourly_rate,
        teamSize: mvp.baseline_estimates.mid_tier.team_size,
      },
      senior: {
        timelineMonths: mvp.baseline_estimates.senior.timeline_months,
        costRange: mvp.baseline_estimates.senior.cost_range,
        hourlyRate: mvp.baseline_estimates.senior.hourly_rate,
        teamSize: mvp.baseline_estimates.senior.team_size,
      },
    },
    keywords: mvp.keywords,
  };
}

/**
 * Get all MVP types by category
 */
export function getMVPsByCategory(category: string): MVPMatch[] {
  return mvpKnowledgeBase.mvp_types
    .filter(m => m.category === category)
    .map(mvp => ({
      id: mvp.id,
      name: mvp.name,
      category: mvp.category,
      confidence: 1.0,
      baselineEstimates: {
        midTier: {
          timelineMonths: mvp.baseline_estimates.mid_tier.timeline_months,
          costRange: mvp.baseline_estimates.mid_tier.cost_range,
          hourlyRate: mvp.baseline_estimates.mid_tier.hourly_rate,
          teamSize: mvp.baseline_estimates.mid_tier.team_size,
        },
        senior: {
          timelineMonths: mvp.baseline_estimates.senior.timeline_months,
          costRange: mvp.baseline_estimates.senior.cost_range,
          hourlyRate: mvp.baseline_estimates.senior.hourly_rate,
          teamSize: mvp.baseline_estimates.senior.team_size,
        },
      },
      keywords: mvp.keywords,
    }));
}

/**
 * Get all available categories
 */
export function getAllCategories(): string[] {
  const categories = new Set(mvpKnowledgeBase.mvp_types.map(m => m.category));
  return Array.from(categories);
}
