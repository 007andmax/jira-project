export class TicketGlobalFilter {
    "id": string;
    "statusId": string;
    "name": string;
    "global": boolean;
    "clientCompanyId": string;
    "createdUserId": string;
    "tagIds": Array<string> = [];
    "status": any;
    "assignedUsersIds": Array<string> = [];
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}