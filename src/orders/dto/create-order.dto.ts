import { OrderItem } from '../../typeorm/entities/order.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  items: OrderItem[];

  @IsNotEmpty()
  tableNumber: number;
}
