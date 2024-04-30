import { OrderItem } from '../order.model';

export class CreateOrderDto {
  items: OrderItem[];
  tableNumber: number;
}
