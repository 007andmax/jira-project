import { User } from './user';

export class UserChange {
    action:string;
    list:Array<User> = [];
    data:User;
    constructor(action,data,list) {
        this.action = action;
        this.list = list;
        this.data = data;
    }
}