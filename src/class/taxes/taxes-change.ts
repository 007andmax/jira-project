import { Tax } from './tax';

export class TaxesChange {
    action:string;
    list:Array<Tax> = [];
    data:any;
    constructor(action,data,list) {
        this.action = action;
        this.list = list;
        this.data = data;
    }
}