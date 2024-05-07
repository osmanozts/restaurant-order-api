import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('json')
  food: Food;

  @Column('json')
  details: string[];

  @Column('json')
  drinks: Drink[];

  @Column()
  description: string;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: 'CASCADE',
    eager: false,
  })
  order: Order;
}

interface Food {
  name: string;
  price: number;
}

interface Drink {
  name: string;
  price: number;
  pfand: boolean;
}
