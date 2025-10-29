import { Task } from "src/app/components/tasks/class/task";

export class TicketProfileTask extends Task {

    isInitEdit: boolean = false;
    isInitRequest: boolean = false;


    public setIsInitRequest(data) {
        this.isInitRequest = data;
    }

    public onInitEdit(data) {
        this.isInitEdit = data;
    }

}