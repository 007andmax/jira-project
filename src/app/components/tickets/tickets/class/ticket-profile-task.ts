import { CurrentUser } from "src/class/current-user/current-user";
import * as moment from "moment";

export class TicketProfileTask {
    "id": string;
    "status": string = "INCOMPLETED";
    "date": string;
    "subject": string = "";
    "assignedUser": CurrentUser;
    selected: boolean = false;
    isInitEdit: boolean = false;
    isInitRequest: boolean = false;
    dateForDatePicker: number = new Date().getTime();
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        } else {
            let date = new Date();
            this.setDate(moment(date).format('YYYY/MM/DD'));
        }

    }
    public setIsInitRequest(data) {
        this.isInitRequest = data;
    }
    public setStatus(data) {
        this.status = data;
    }
    public setAssignedUser(data) {
        this.assignedUser = data;
    }
    public setDate(data) {
        this.dateForDatePicker = new Date(data).getTime();
        this.date = data;
    }
    public getDataForUpdate() {
        let data: any = {
            id: this.id,
            "status": this.status,
            "subject": this.subject,
        };
        if (this.assignedUser) data.assignedUserId = this.assignedUser.id;
        if (this.date) data.date = this.date;
        return data
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
    public getDataForAdd(ticketId) {
        let data: any = {
            "ticketId": ticketId,
            "status": this.status,
            "subject": this.subject,

        };
        if (this.assignedUser) data.assignedUserId = this.assignedUser.id;
        if (this.date) data.date = this.date;
        return data
    }
}