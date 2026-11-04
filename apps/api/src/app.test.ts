import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "./app.js";

describe("HTTP application", () => {
  it("exposes a health endpoint", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
  it("returns a consistent not-found response", async () => {
    const response = await request(app).get("/missing-route");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
