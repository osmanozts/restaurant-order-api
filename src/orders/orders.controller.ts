import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../typeorm/entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  private getOrders(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }

  @Get('/:id')
  private getOrderById(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  private createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Delete('/:id')
  private deleteOrder(@Param('id') id: string): Promise<void> {
    return this.ordersService.deleteOrder(id);
  }
}
