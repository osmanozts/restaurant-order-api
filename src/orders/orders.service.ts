import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../typeorm/entities/order.entity';
import { OrderStatusEnum } from './models/order.status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getOrders(): Promise<Order[]> {
    const query = this.orderRepository.createQueryBuilder('orders');
    const orders = await query.getMany();
    return orders;
  }

  async getOrderById(id: string): Promise<Order> {
    const foundOrder = await this.orderRepository.findOneBy({ id });
    if (!foundOrder) throw new NotFoundException();
    return foundOrder;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, tableNumber } = createOrderDto;

    const newOrder = await this.orderRepository.create({
      items,
      tableNumber,
      status: OrderStatusEnum.DRAFT,
    });

    await this.orderRepository.save(newOrder);

    return newOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    const result = await this.orderRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException();
  }
}
