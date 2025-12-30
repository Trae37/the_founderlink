// Submit a test assessment and print the results URL
const sampleResponses = {
  0: "Test User",
  1: "test@example.com",
  2: "$10,000 - $25,000",
  3: "I have a clear idea and some wireframes",
  4: "8-12 weeks",
  5: "I'm a non-technical founder",
  6: "Build a new product from scratch",
  7: "A SaaS platform for project management with real-time collaboration and payment processing",
  8: ["User accounts and login", "Payment processing", "Admin dashboard"],
  9: "More than 7 or almost a full app",
  10: "Yes, I need a mobile app too",
  11: ["Let users pay online", "User accounts and login", "Admin dashboard"],
  12: "I don't know yet",
  13: ["Stripe"],
  14: "I don't know, recommend for me",
  15: "I don't know, recommend for me",
  16: "Moderate - GDPR, basic security",
  17: "Hundreds of users within 6 months",
  18: "Yes",
  19: "Mixed",
  20: "Choosing the wrong person",
  21: "Speed - I need to launch quickly",
  22: "I don't know, please recommend the best path",
  23: [],
  24: "Solo founder",
  25: "Full-time on this project",
  26: "Need multi-tenant support and real-time updates",
  27: "Must integrate with Stripe",
  28: "Looking to launch MVP in 3 months"
};

// Store in localStorage format
const assessmentData = {
  responses: sampleResponses,
  currentSection: 6,
  completedSections: [0, 1, 2, 3, 4, 5]
};

console.log('\n📋 Assessment Data (paste into browser console):');
console.log('localStorage.setItem("assessment", JSON.stringify(' + JSON.stringify(assessmentData) + '));');
console.log('\nThen navigate to: /assessment');
console.log('And click through to results page\n');
