export class ManufacturesCheckUseItem {
    "id": string;
    "name": string;
    "companyId": string;
    indexColor: number = 0;
    constructor(data, indexColor) {
        this.id = data.id;
        this.name = data.name;
        this.companyId = data.companyId;
        this.indexColor = indexColor;
    }
}