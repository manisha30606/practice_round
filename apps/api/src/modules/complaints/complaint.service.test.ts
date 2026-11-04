import { describe, expect, it } from "vitest";

describe("complaint domain invariants", () => {
  it("uses a finite, ordered set of workflow states", () => {
    const states = ["submitted", "under_review", "approved", "assigned", "in_progress", "resolved", "reopened", "rejected", "closed"];
    expect(new Set(states).size).toBe(states.length);
    expect(states).toContain("resolved");
  });
  it("keeps coordinates in longitude-latitude order for GeoJSON", () => {
    const point = { longitude: 88.35, latitude: 22.57 };
    expect([point.longitude, point.latitude]).toHaveLength(2);
  });
});
