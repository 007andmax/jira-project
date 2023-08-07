export class TicketGlobalFilter {
    "id": string;
    "statusId": string;
    "name": string = "";
    "global": boolean = false;
    "clientCompanyId": string;
    "createdUserId": string;
    "tagIds": Array<string> = [];
    "status": any;
    "assignedUsersIds": Array<string> = [];
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
    /**
* @description Return Object for Ticket Global 
* @returns  {Object} This is the result
*/
    public getDataForRequest() {
        return {
            "clientCompanyId": this.clientCompanyId,
            "statusId": this.statusId,
            "name": this.name,
            "global": this.global,
            "createdUserId": this.createdUserId,
            "tagIds": this.tagIds,
            "assignedUsersIds": this.assignedUsersIds
        }
    }
    public setClientCompanyId(data) {
        this.clientCompanyId = data;
    }
    public setCreatedUserId(data) {
        this.createdUserId = data;
    }
    public setAssignedUsersIds(data) {
        this.assignedUsersIds = data;
    }
    public setStatusId(data) {
        this.statusId = data;
    }
    public setTagIds(data) {
        this.tagIds = data;
    }
}