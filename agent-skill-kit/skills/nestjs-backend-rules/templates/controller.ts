import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CreateResourceDto } from "./dto/create-resource.dto";
import { ResourceService } from "./resource.service";

@Controller("resources")
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.resourceService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateResourceDto) {
    return this.resourceService.create(dto);
  }
}
