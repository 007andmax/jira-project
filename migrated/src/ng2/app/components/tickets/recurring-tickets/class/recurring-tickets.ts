export class RecurringTickets {
    description:string;
    cronExpression:any;
    requireUpdate: boolean;
    quickClose: boolean;
    createTask: boolean;
    company:string;
    tags:Array<string>;
    agents:Array<string>;
    assignedUsers:Array<string>;
    products:any;
    services: any;
    startDate: number;
    date: string;
    constructor () {}
    public setDate (date) {
        this.date = date;
    }
}