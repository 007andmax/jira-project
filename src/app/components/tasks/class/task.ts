export class Task {
    id: string;
    "dueDate": number;
    "startDate": number;
    "endDate": number;
    "type": string;
    "title": string;
    "description": string;
    "companyId": string;
    "associatedTicketId": string;
    "taskTicketId": string;
    "estimatedMinutes": number;
    "taskStatus": string;
    "assignedUsersIds": Array<string> = [];
    ticketUpdateList: Array<any> = [];
    attachFileIds: Array<string> = [];
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
    public setAssignedUser(user) {
        this.assignedUsersIds = user;
    }
    public setDueDate(day, month, year, timeOffset) {
        this.dueDate = this.parseDate(day, month, year, timeOffset);
    }
    public setStartDate(day, month, year, timeOffset) {
        this.startDate = this.parseDate(day, month, year, timeOffset);
    }
    parseDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            return finalDate.getTime();
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            return finalDate.getTime();
        }
    }
    public getDataForAdd(data) {
        return {
            title: data.title,
            startDate: data.startDate,
            description: data.description ? data.description : undefined,
            endDate: data.endDate,
            assignedUsersIds: data.assignedUsersIds,
            type: data.type,
            taskStatus: data.taskStatus,
            companyId: data.companyId ? data.companyId : undefined,
            associatedTicketId: data.associatedTicketId ? data.associatedTicketId : undefined,
            dueDate: data.dueDate ? data.dueDate : undefined,
            ticketUpdates: data.ticketUpdates && data.ticketUpdates.length > 0 ? data.ticketUpdates : undefined,
            attachFileIds: data.attachFileIds ? data.attachFileIds : undefined,
            taskTicketId: data.taskTicketId ? data.taskTicketId : undefined,
        }
    }
}