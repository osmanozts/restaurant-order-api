import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from '../../orders/models/order.item';
import { OrderStatusEnum } from '../../orders/models/order.status.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('json')
  items: OrderItem[];

  @Column()
  tableNumber: number;

  @Column()
  status: OrderStatusEnum;
}
