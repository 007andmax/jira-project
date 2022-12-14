import { VersionedId } from '../versioned-id';
import { Tax } from '../service/tax';
import { Category } from './category';

export interface Product {
    versionedId: VersionedId;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    company: any;
    cost: number;
    cost_str: string;
    sale: number;
    sale_str: string;
    category: Category;
    ilc: string;
    glNumber: number;
    manufacture: string;
    description: string;
    billable: boolean;
    taxes: Array<Tax>;
    oldVersion: boolean;
}