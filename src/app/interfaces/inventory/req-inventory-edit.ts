import { VersionedId } from '../versioned-id';
export interface reqInventoryEdit {
    versionedId: VersionedId;
    ilc: string;
    cost: number;
    sale: number;
    manufacture: string;
    description: string;
    companyId: string;
    taxIds: Array<String>;
    categoryId: string;
    active: boolean;
    glNumber: { id: string };
}