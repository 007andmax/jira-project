export class InventoryAgreement {
    companyId: string;
    description: string;
    id: string;
    indexColor: number = 0;
    constructor(data, indexColor) {
        this.companyId = data.companyId;
        this.description = data.description;
        this.id = data.id;
        this.indexColor = indexColor;
    }
}