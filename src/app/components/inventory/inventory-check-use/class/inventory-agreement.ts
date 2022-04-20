export class InventoryAgreement {
    companyId: string;
    description: string;
    id: string;
    constructor(data) {
        this.companyId = data.companyId;
        this.description = data.description;
        this.id = data.id;
    }
}