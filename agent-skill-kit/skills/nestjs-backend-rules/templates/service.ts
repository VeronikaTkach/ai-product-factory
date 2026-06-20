import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateResourceDto } from "./dto/create-resource.dto";

@Injectable()
export class ResourceService {
  async findById(id: string) {
    const resource = await this.findResource(id);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    return resource;
  }

  async create(dto: CreateResourceDto) {
    return {
      id: "generated-id",
      ...dto,
    };
  }

  private async findResource(id: string) {
    return {
      id,
      name: "Example resource",
    };
  }
}
