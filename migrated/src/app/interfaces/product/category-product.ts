import { Product } from './product';

export interface CategoryProduct {
    commissionRate: any;
    default: boolean;
    id: string;
    isDefault: boolean;
    name: string;
    products: Array<Product>;
    productsAmount: number;
}