import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.model';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  private getAllOrders(): Order[] {
    return this.ordersService.getAllOrders();
  }

  @Post()
  private createOrder(@Body() createOrderDto: CreateOrderDto): Order {
    return this.ordersService.createOrder(createOrderDto);
  }
}
