import { VersionedId } from '../versioned-id';

export interface EditProduct {
    categoryId: string;
    cost: number;
    description: string;
    glNumber: string;
    ilc: string;
    manufacture: string;
    sale: number;
    taxIds: any;
    versionedId: VersionedId;
}