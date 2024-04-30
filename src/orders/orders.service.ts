import { Injectable } from '@nestjs/common';
import { Order, OrderStatusEnum } from './order.model';
import { v4 as uuid } from 'uuid';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private orders: Order[];

  public getAllOrders(): Order[] {
    return this.orders;
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

    console.log('🚀 ~ newOrder:', newOrder);

    return newOrder;
  }

  public randomShit() {
    const payload = {
      items: [
        {
          food: {
            name: 'Döner Tasche',
            price: 6.0,
          },
          details: ['Marol', 'Coban', 'Sogan', 'Cacik', 'P - K'],
          drinks: [
            {
              name: 'Uludag',
              price: 1.5,
              pfand: false,
            },
          ],
          description: '',
        },
        {
          food: {
            name: 'Döner Tasche',
            price: 6.0,
          },
          details: ['Marol', 'Coban', 'Sogan', 'Cacik', 'P - K'],
          drinks: [
            {
              name: 'Uludag',
              price: 1.5,
              pfand: false,
            },
          ],
          description: '',
        },
      ],
      tableNumber: 1,
    };
  }
}
