import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../typeorm/entities/order.entity';
import { OrderStatusEnum } from '../typeorm/entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from 'src/typeorm/entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async getOrders(): Promise<Order[]> {
    const orders = await this.orderRepository.find({});

    return orders;
  }

  async getOrderById(id: string): Promise<Order> {
    const foundOrder = await this.orderRepository.findOneBy({ id });
    if (!foundOrder) throw new NotFoundException('Order could not be Found');
    return foundOrder;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, tableNumber } = createOrderDto;

    const newOrder = await this.orderRepository.create({
      orderItems: items,
      tableNumber,
      status: OrderStatusEnum.DRAFT,
    });

    await this.orderRepository.save(newOrder);
    items.forEach(async (item) => {
      const newOrderOtem = await this.orderItemRepository.create({
        food: item.food,
        details: item.details,
        drinks: item.drinks,
        description: item.description,
        order: newOrder,
      });

      await this.orderItemRepository.save(newOrderOtem);
    });

    return newOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    const result = await this.orderRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException('Order could not be Found');
  }
}
