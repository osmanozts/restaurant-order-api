import { OrderItem } from '../order.model';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  items: OrderItem[];

  @IsNotEmpty()
  tableNumber: number;
}
