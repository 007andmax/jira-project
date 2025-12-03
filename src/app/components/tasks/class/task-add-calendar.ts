export class TaskAddCalendar {
    startDate: number;
    assignedUser: any;
    constructor(data?: any) {
        this.startDate = data && data.startDate ? data.startDate : new Date().getTime();
        this.assignedUser = data && data.assignedUser ? data.assignedUser : null;
    }
}