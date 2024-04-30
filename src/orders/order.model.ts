export interface Order {
  id: string;
  items: OrderItem[];
  tableNumber: number;
  status: OrderStatusEnum;
}

export enum OrderStatusEnum {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  SERVED = 'SERVED',
  DELETED = 'DELETED',
}

export interface OrderItem {
  food: { name: string; price: number };
  details: string[];
  drinks: { name: string; price: number; pfand: boolean }[];
  description: string;
}
