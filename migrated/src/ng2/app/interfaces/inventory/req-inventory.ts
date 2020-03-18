export interface reqInventory {
    cost: number;
    sale: number;
    manufacture: string;
    description: string;
    companyId: string;
    taxIds: Array<String>;
    categoryId: string;
    glNumber: { id: string };
}