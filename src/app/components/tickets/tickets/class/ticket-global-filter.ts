export class TicketGlobalFilter {
    "id": string;
    "statusIds": Array<string> = [];
    "name": string = "";
    "global": boolean = false;
    "clientCompanyIds": Array<string> = [];
    "createdUserIds": Array<string> = [];
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
        if (this.clientCompanyIds.length > 0) data.clientCompanyIds = this.clientCompanyIds;
        if (this.statusIds.length > 0) data.statusIds = this.statusIds;
        if (this.createdUserIds.length > 0) data.createdUserIds = this.createdUserIds;
        if (isAdd && this.tagIds.length > 0) data.tagIds = this.tagIds;
        if (!isAdd) data.tagIds = this.tagIds;
        if (this.assignedUsersIds.length > 0) data.assignedUsersIds = this.assignedUsersIds;
        if (this.priorityIds.length > 0) data.priorityIds = this.priorityIds;
        return data
    }
    public setClientCompaies(data) {
        this.clientCompanyIds = data;
    }
    public setCreatedUserIds(data) {
        this.createdUserIds = data;
    }
    public setAssignedUsersIds(data) {
        this.assignedUsersIds = data;
    }
    public setStatusIds(data) {
        this.statusIds = data;
    }
    public setTagIds(data) {
        this.tagIds = data;
    }
    public setPriorityIds(data) {
        this.priorityIds = data;
    }
    public isUseFilters() {
        return this.clientCompanyIds.length > 0 || this.createdUserIds.length > 0 || this.assignedUsersIds.length > 0 || this.statusIds.length > 0 || this.tagIds.length > 0 || this.priorityIds.length > 0;
    }
}