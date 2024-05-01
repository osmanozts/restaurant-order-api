import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderStatusEnum } from './order.model';
import { v4 as uuid } from 'uuid';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  public getAllOrders(): Order[] {
    return this.orders;
  }

  public getOrderById(id: string): Order {
    const foundOrder: Order = this.orders.find((order) => order.id == id);

    if (!foundOrder) throw new NotFoundException();
    return foundOrder;
  }

  public createOrder(createOrderDto: CreateOrderDto): Order {
    const { items, tableNumber } = createOrderDto;

    const newOrder: Order = {
      id: uuid(),
      items: items,
      tableNumber: tableNumber,
      status: OrderStatusEnum.DRAFT,
    };

    this.orders?.push(newOrder);

    return newOrder;
  }

  public deleteOrder(id: string): Order[] {
    const foundOrder = this.orders.find((order) => order.id == id);

    if (!foundOrder) throw new NotFoundException();

    const filteredOrders = this.orders.filter((order) => order.id != id);
    this.orders = filteredOrders;
    return this.orders;
  }
}
