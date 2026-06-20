import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";

type TCreateOrderInput = {
  userId: string;
  dto: CreateOrderDto;
};

type TFindVisibleOrderInput = {
  userId: string;
  orderId: string;
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findVisibleOrder({ userId, orderId }: TFindVisibleOrderInput) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        totalCents: true,
        ownerId: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.ownerId !== userId) {
      throw new ForbiddenException("You do not have access to this order");
    }

    return {
      id: order.id,
      status: order.status,
      totalCents: order.totalCents,
    };
  }

  async createOrder({ userId, dto }: TCreateOrderInput) {
    return this.prisma.order.create({
      data: {
        ownerId: userId,
        totalCents: dto.totalCents,
        status: "draft",
      },
      select: {
        id: true,
        status: true,
        totalCents: true,
      },
    });
  }
}
