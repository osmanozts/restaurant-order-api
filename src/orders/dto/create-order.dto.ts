import { OrderItem } from '../../typeorm/entities/order-item.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  items: OrderItem[];

  @IsNotEmpty()
  tableNumber: number;
}
