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
    sale: number;
    category: Category;
    ilc: string;
    glNumber: number;
    manufacture: string;
    description: string;
    billable: boolean;
    taxes: Array<Tax>;
    oldVersion: boolean;
}