import { Test } from "@nestjs/testing";

import { ResourceService } from "./resource.service";

describe("ResourceService", () => {
  let service: ResourceService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ResourceService],
    }).compile();

    service = moduleRef.get(ResourceService);
  });

  it("returns the expected resource", async () => {
    await expect(service.findById("resource-id")).resolves.toMatchObject({
      id: "resource-id",
    });
  });
});
