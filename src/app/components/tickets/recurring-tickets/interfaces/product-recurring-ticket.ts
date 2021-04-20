import { Product } from 'src/app/interfaces/product/product';

export class ProductRecurringTicket {
    id: string;
    product: Product;
    quantity: number;
    discount: number;
}