import { OrderItem } from '../models/order.item';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  items: OrderItem[];

  @IsNotEmpty()
  tableNumber: number;
}
