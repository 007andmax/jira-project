import { VersionedId } from './versioned-id';

export class Product {
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