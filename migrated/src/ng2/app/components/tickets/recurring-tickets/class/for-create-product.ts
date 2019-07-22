import { VersionedId } from '../../../../interfaces/versioned-id';
import { Product } from 'src/ng2/app/interfaces/product/product';
import { ProductRecurringTicket } from '../interfaces/product-recurring-ticket';

export class ForCreateProduct  {
    cost: number;
    description: string = '';
    glNumber: any;
    ilc: any;
    manufacture: string;
    name:string;
    sale: number;
    taxes: any;
    versionedId: VersionedId;
    quantity:number;
    discount: number;
    isDropDownShowProducts: false;
    constructor () {}
    public setDataFromEdit (data:ProductRecurringTicket) {
        this.quantity = data.quantity;
        this.discount = data.discount;
        this.cost = data.product.cost;
        this.description = data.product.description;
        this.glNumber = data.product.glNumber;
        this.ilc = data.product.ilc;
        this.manufacture = data.product.manufacture;
        this.sale = data.product.sale;
        this.taxes = data.product.taxes;
        this.versionedId = data.product.versionedId;
    }
}