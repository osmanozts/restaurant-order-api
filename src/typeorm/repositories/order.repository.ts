import { EntityRepository, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../../orders/dto/create-order.dto';
import { OrderStatusEnum } from '../../orders/models/order.status.enum';

//DEPRECATED
@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async getOrders(): Promise<Order[]> {
    const query = this.createQueryBuilder('orders');

    const orders = await query.getMany();
    return orders;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, tableNumber } = createOrderDto;

    const newOrder = await this.create({
      items,
      tableNumber,
      status: OrderStatusEnum.DRAFT,
    });

    await this.save(newOrder);

    return newOrder;
  }
}
