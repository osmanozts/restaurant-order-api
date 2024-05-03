export interface OrderItem {
  food: { name: string; price: number };
  details: string[];
  drinks: { name: string; price: number; pfand: boolean }[];
  description: string;
}
