import { ComplexityAnalyzer } from './server/services/complexity-analyzer';
import { RecommendationEngine } from './server/services/recommendation-engine';

// Sample assessment responses (complex SaaS project)
const sampleResponses = {
  0: "John Doe",
  1: "john@example.com",
  2: "$10,000 - $25,000",
  3: "I have a clear idea and some wireframes",
  4: "8-12 weeks",
  5: "I'm a non-technical founder",
  6: "Build a new product from scratch",
  7: "A multi-tenant SaaS platform for project management with real-time collaboration, user roles and permissions, payment processing via Stripe, analytics dashboard for admins, and integration with Slack and Google Calendar.",
  8: ["User accounts and login", "Payment processing", "Admin dashboard"],
  9: "More than 7 or almost a full app",
  10: "Yes, I need a mobile app too",
  11: ["Let users pay online", "User accounts and login", "Admin dashboard", "Send notifications", "Real-time updates"],
  12: "I don't know yet",
  13: ["Stripe", "Slack API"],
  14: "I don't know, recommend for me",
  15: "I don't know, recommend for me",
  16: "Moderate - GDPR, basic security",
  17: "Hundreds of users within 6 months",
  18: "Yes",
  19: "Mixed",
  20: "Choosing the wrong person or making the wrong hire",
  21: "Speed - I need to launch quickly",
  22: "I don't know, please recommend the best path",
  23: [],
  24: "Solo founder, no technical co-founder yet",
  25: "Full-time on this project",
  26: "The platform needs to support multiple organizations (multi-tenant), each with their own users, projects, and billing. Real-time updates are critical for team collaboration. Need robust admin controls for managing users and viewing analytics.",
  27: "Must integrate with Stripe for subscriptions. Need to comply with GDPR for EU customers. Mobile responsiveness is required but native mobile app can come later.",
  28: "Looking to launch MVP in 3 months, then iterate based on user feedback."
};

async function testComplexityAnalyzer() {
  console.log('\n=== Testing Complexity Analyzer ===\n');
  
  const analyzer = new ComplexityAnalyzer();
  
  try {
    const analysis = await analyzer.analyzeComplexity(sampleResponses);
    
    console.log('✅ Complexity Analysis Successful');
    console.log('Complexity Level:', analysis.complexity);
    console.log('Confidence:', analysis.confidence);
    console.log('Reasoning:', analysis.reasoning);
    console.log('Enriched Description:', analysis.enrichedDescription.substring(0, 150) + '...');
    console.log('Detected Features:', analysis.detectedFeatures.slice(0, 5));
    console.log('Technical Requirements:', analysis.technicalRequirements.slice(0, 5));
    console.log('Integration Needs:', analysis.integrationNeeds);
    console.log('Scalability Needs:', analysis.scalabilityNeeds);
    
    return analysis;
  } catch (error) {
    console.error('❌ Complexity Analysis Failed:', error);
    throw error;
  }
}

async function testRecommendationEngine() {
  console.log('\n=== Testing Recommendation Engine ===\n');
  
  const engine = new RecommendationEngine();
  
  try {
    // Use 'custom' route for complex SaaS project
    const recommendation = await engine.generateRecommendations(sampleResponses, 'custom');
    
    console.log('✅ Recommendation Generation Successful');
    console.log('Route:', recommendation.route);
    console.log('Stack Description:', recommendation.stackDescription.substring(0, 150) + '...');
    console.log('Developer Type:', recommendation.developerType);
    console.log('Reasoning:', recommendation.reasoning.substring(0, 150) + '...');
    console.log('Route Reasoning:', recommendation.routeReasoning?.substring(0, 150) + '...');
    console.log('Team Size:', recommendation.teamSize);
    
    if (recommendation.complexityAnalysis) {
      console.log('\n✅ Complexity Analysis Included in Recommendation');
      console.log('Complexity:', recommendation.complexityAnalysis.complexity);
    } else {
      console.log('\n❌ Complexity Analysis Missing from Recommendation');
    }
    
    if (recommendation.teamBreakdown) {
      console.log('\n✅ Team Breakdown Included');
      console.log('Team Members:', recommendation.teamBreakdown.length);
    }
    
    return recommendation;
  } catch (error) {
    console.error('❌ Recommendation Generation Failed:', error);
    throw error;
  }
}

async function runTests() {
  console.log('🧪 Starting Assessment API Tests...\n');
  
  try {
    // Test 1: Complexity Analyzer
    await testComplexityAnalyzer();
    
    // Test 2: Recommendation Engine (includes complexity analysis)
    await testRecommendationEngine();
    
    console.log('\n✅ All Tests Passed!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Tests Failed\n');
    process.exit(1);
  }
}

runTests();
