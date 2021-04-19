export class InventoryCategory   {
    id: string;
    name: string;
    productsAmount: number;
    commissionRate: any;
    isDefault: boolean;
    default: boolean;
    constructor(data) {
        if (data) {
            this.id = data.id;
            this.name= data.name;
            this.productsAmount= data.productsAmount;
            this.commissionRate= data.commissionRate;
            this.isDefault= data.isDefault;
            this.default= data.default;
        }
      
    }
}