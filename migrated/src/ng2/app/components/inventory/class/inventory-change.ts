import { InventoryItem } from './inventory-item';

export class InventoryChange {
    action:string;
    list:Array<InventoryItem> = [];
    data:any;
    constructor(action,data,list) {
        this.action = action;
        this.list = list;
        this.data = data;
    }
}