import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get('/:id')
  private getOrderById(@Param('id') id: string): Order {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  private createOrder(@Body() createOrderDto: CreateOrderDto): Order {
    return this.ordersService.createOrder(createOrderDto);
  }
}
