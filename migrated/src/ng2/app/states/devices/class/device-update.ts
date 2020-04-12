export class DeviceUpdate {
    action:string;
    list:Array<any> = [];
    data:any;
    constructor(action,data,list) {
        this.action = action;
        this.list = list;
        this.data = data;
    }
}
