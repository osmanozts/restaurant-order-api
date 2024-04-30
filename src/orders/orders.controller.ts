import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Delete('/:id')
  private deleteOrder(@Param('id') id: string): Order[] {
    return this.ordersService.deleteOrder(id);
  }

  @Delete('/:id/:updatedOrder')
  private updateOrder(
    @Param('id') id: string,
    @Param('updatedOrder') updatedOrder: Order,
  ): Order[] {
    return this.ordersService.updateOrder(id, updatedOrder);
  }
}
