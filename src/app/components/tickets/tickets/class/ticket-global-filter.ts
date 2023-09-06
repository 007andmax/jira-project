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
    priorityIds: Array<string> = [];
    modified: boolean;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
    /**
* @description Return Object for Ticket Global 
* @param {boolean} isAdd - If need return Object for Add need 'true' if for edit need 'false'
* @returns  {Object} This is the result
*/
    public getDataForRequest(isAdd) {
        let data: any = {
            name: this.name,
            global: this.global
        };
        if (this.clientCompanyId) data.clientCompanyId = this.clientCompanyId;
        if (this.statusId) data.statusId = this.statusId;
        if (this.createdUserId) data.createdUserId = this.createdUserId;
        if (isAdd && this.tagIds.length > 0) data.tagIds = this.tagIds;
        if (!isAdd) data.tagIds = this.tagIds;
        if (this.assignedUsersIds) data.assignedUsersIds = this.assignedUsersIds;
        if (this.priorityIds) data.priorityIds = this.priorityIds;
        return data
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
    public setPriorityIds(data) {
        this.priorityIds = data;
    }
    public isUseFilters() {
        return this.clientCompanyId || this.createdUserId || this.assignedUsersIds.length > 0 || this.statusId || this.tagIds.length > 0 || this.priorityIds.length > 0;
    }
}