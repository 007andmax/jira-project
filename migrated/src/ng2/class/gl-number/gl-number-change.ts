import { GlNumber } from './gl-number';

export class GlNumberChange {
    action:string;
    list:Array<GlNumber> = [];
    data:any;
    constructor(action,data,list) {
        this.action = action;
        this.list = list;
        this.data = data;
    }
}