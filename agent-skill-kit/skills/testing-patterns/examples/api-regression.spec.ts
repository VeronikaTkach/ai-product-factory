import request from "supertest";

import { app } from "../test-app";

describe("GET /orders/:id", () => {
  it("rejects access to another user's order", async () => {
    await request(app.getHttpServer())
      .get("/orders/order-owned-by-someone-else")
      .set("Authorization", "Bearer user-token")
      .expect(403);
  });
});
