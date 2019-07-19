import { VersionedId } from '../../../../interfaces/versioned-id';
import { Product } from 'src/ng2/app/interfaces/product/product';

export class ForCreateProduct  {
    cost: any;
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
}