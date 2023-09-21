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
    customDateRange: string = null;
    startDate: string = null;
    endDate: string = null;
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
        if (this.customDateRange) data.customDateRange = this.customDateRange;
        if (this.startDate) data.startDate = this.startDate;
        if (this.endDate) data.endDate = this.endDate;
        return data
    }
    /**
* @description Set new value "startDate"
* @param {String} data - new value "startDate"
*/
    public setStartDate(data) {
        this.startDate = data;
    }
    /**
* @description Set new value "endDate"
* @param {String} data - new value "endDate"
*/
    public setEndDate(data) {
        this.endDate = data;
    }
    /**
* @description Clear values "startDate" "endDate"
*/
    public clearDates() {
        this.startDate = null;
        this.endDate = null;
    }
    /**
* @description Set new value "clientCompanyIds"
* @param {Array<string>} data - Array of String
*/
    public setClientCompaies(data) {
        this.clientCompanyIds = data;
    }
    /**
* @description Set new value "createdUserIds"
* @param {Array<string>} data - Array of String
*/
    public setCreatedUserIds(data) {
        this.createdUserIds = data;
    }
    /**
* @description Set new value "assignedUsersIds"
* @param {Array<string>} data - Array of String
*/
    public setAssignedUsersIds(data) {
        this.assignedUsersIds = data;
    }
    /**
* @description Set new value "customDateRange"
* @param {String} data - new value "customDateRange"
*/
    public setCustomDateRange(data) {
        this.customDateRange = data;
    }
    /**
* @description Set new value "statusIds"
* @param {Array<string>} data - Array of String
*/
    public setStatusIds(data) {
        this.statusIds = data;
    }
    /**
* @description Set new value "tagIds"
* @param {Array<string>} data - Array of String
*/
    public setTagIds(data) {
        this.tagIds = data;
    }
    /**
* @description Set new value "priorityIds"
* @param {Array<string>} data - Array of String
*/
    public setPriorityIds(data) {
        this.priorityIds = data;
    }
    /**
* @description Return True if use one of filters
* @returns  {Boolean} This is the result
*/
    public isUseFilters() {
        return this.clientCompanyIds.length > 0 || this.createdUserIds.length > 0 || this.assignedUsersIds.length > 0 || this.statusIds.length > 0 || this.tagIds.length > 0 || this.priorityIds.length > 0 || this.customDateRange || this.startDate || this.endDate;
    }
}