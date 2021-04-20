export interface reqInventoryAdd {
    ilc:string;
    cost: number;
    sale: number;
    manufacture: string;
    description: string;
    companyId: string;
    taxIds: Array<String>;
    categoryId: string;
    glNumber: { id: string };
}