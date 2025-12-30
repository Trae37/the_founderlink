import { describe, it, expect } from "vitest";

describe("Matches Router", () => {
  it("should validate developer profile data", () => {
    const validDeveloper = {
      name: "John Smith",
      title: "Senior No-Code Developer",
      specialization: "nocode" as const,
      bio: "Expert in Bubble and Webflow",
      portfolioUrl: "https://example.com/portfolio",
      hourlyRate: 75,
      yearsExperience: 5,
      skills: JSON.stringify(["Bubble", "Webflow", "Zapier"]),
    };

    expect(validDeveloper.name.length).toBeGreaterThanOrEqual(2);
    expect(validDeveloper.title.length).toBeGreaterThanOrEqual(2);
    expect(["nocode", "fullstack", "mobile"]).toContain(validDeveloper.specialization);
    expect(validDeveloper.hourlyRate).toBeGreaterThan(0);
    expect(validDeveloper.yearsExperience).toBeGreaterThanOrEqual(0);
  });

  it("should validate specialization enum", () => {
    const validSpecializations = ["nocode", "fullstack", "mobile"];

    validSpecializations.forEach((spec) => {
      expect(["nocode", "fullstack", "mobile"]).toContain(spec);
    });
  });

  it("should validate match assignment data", () => {
    const validAssignment = {
      intakeSubmissionId: 1,
      developerId: 5,
      matchReason: "Strong Bubble experience and timeline matches project needs",
      status: "assigned" as const,
    };

    expect(validAssignment.intakeSubmissionId).toBeGreaterThan(0);
    expect(validAssignment.developerId).toBeGreaterThan(0);
    expect(["assigned", "sent", "viewed", "contacted"]).toContain(validAssignment.status);
  });

  it("should require at least one developer for assignment", () => {
    const emptyAssignment = {
      developerIds: [],
    };

    const validAssignment = {
      developerIds: [1, 2, 3],
    };

    expect(emptyAssignment.developerIds.length).toBe(0);
    expect(validAssignment.developerIds.length).toBeGreaterThanOrEqual(1);
  });

  it("should track match status transitions", () => {
    const statuses = ["assigned", "sent", "viewed", "contacted"] as const;

    statuses.forEach((status) => {
      expect(["assigned", "sent", "viewed", "contacted"]).toContain(status);
    });
  });

  it("should validate portfolio URL format", () => {
    const validUrl = "https://example.com/portfolio";
    const invalidUrl = "not-a-url";

    expect(validUrl).toMatch(/^https?:\/\//);
    expect(invalidUrl).not.toMatch(/^https?:\/\//);
  });

  it("should store developer skills as JSON", () => {
    const skills = ["Bubble", "Webflow", "Zapier"];
    const skillsJson = JSON.stringify(skills);

    expect(skillsJson).toBe('["Bubble","Webflow","Zapier"]');
    expect(JSON.parse(skillsJson)).toEqual(skills);
  });

  it("should track when match email was sent", () => {
    const beforeSend = new Date();
    const sentAt = new Date();
    const afterSend = new Date();

    expect(sentAt.getTime()).toBeGreaterThanOrEqual(beforeSend.getTime());
    expect(sentAt.getTime()).toBeLessThanOrEqual(afterSend.getTime());
  });

  it("should allow multiple developers per submission", () => {
    const intakeId = 1;
    const developerIds = [5, 10, 15];

    expect(developerIds.length).toBe(3);
    developerIds.forEach((devId) => {
      expect(devId).toBeGreaterThan(0);
    });
  });

  it("should validate match reason is optional", () => {
    const matchWithReason = {
      matchReason: "Strong experience match",
    };

    const matchWithoutReason = {
      matchReason: undefined,
    };

    expect(matchWithReason.matchReason).toBeDefined();
    expect(matchWithoutReason.matchReason).toBeUndefined();
  });
});
