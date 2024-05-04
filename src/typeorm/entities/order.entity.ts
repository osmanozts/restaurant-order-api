import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

export interface OrderItem {
  food: { name: string; price: number };
  details: string[];
  drinks: { name: string; price: number; pfand: boolean }[];
  description: string;
}

export enum OrderStatusEnum {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  SERVED = 'SERVED',
  DELETED = 'DELETED',
}
