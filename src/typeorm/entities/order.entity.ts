import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany((_type) => OrderItem, (orderItem) => orderItem.order, {
    eager: true,
  })
  orderItems: OrderItem[];

  @Column()
  tableNumber: number;

  @Column()
  status: OrderStatusEnum;
}

export enum OrderStatusEnum {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  SERVED = 'SERVED',
  DELETED = 'DELETED',
}
