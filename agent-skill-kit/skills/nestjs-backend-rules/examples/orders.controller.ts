import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

type TCurrentUser = {
  id: string;
  roles: string[];
};

@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(":id")
  async findById(@CurrentUser() user: TCurrentUser, @Param("id") orderId: string) {
    return this.ordersService.findVisibleOrder({ userId: user.id, orderId });
  }

  @Post()
  async create(@CurrentUser() user: TCurrentUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder({ userId: user.id, dto });
  }
}
