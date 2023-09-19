import { Company } from 'src/app/interfaces/company/company';
import { User } from '../../../users/class/user';
import { TicketStatusFilter } from '../tickets-header/class/ticket-status-filter';
import { TicketsPriority } from 'src/app/components/setting/ticket-settings-page/tickets-priority/class/tickets-priority';
import { CompanyFilterTop } from 'src/app/components/companies/class/company-filter-top';

export class TicketsFilter {
    listType: string = "USERS";
    title: string = "All Tickets";
    sortBy: string = null;
    payloadAll = null;
    payloadUnassigned = null;
    payloadOpen = null;
    payloadClosed = null;
    payloadOnhold = null;
    payloadTrash = null;
    payloadRecurringTicketsClosed = null;
    payloadRecurringTicketsOpen = null;
    payloadUser = null;
    payloadSpam = null;
    payloadCompleted = null;
    payloadInProgress = null;
    tags = [];
    selectedPriorityLevels: Array<TicketsPriority> = [];
    selectedCompanies: Array<Company> = [];
    selectedTechUsers: Array<User> = [];
    selectedUsers: Array<User> = [];
    selectedStatus: Array<TicketStatusFilter> = [];
    customStatus: boolean = false;
    isDisbledCompany: boolean = false;
    filter: Array<CompanyFilterTop> = [
        new CompanyFilterTop('company', ''),
        new CompanyFilterTop('created', ''),
        new CompanyFilterTop('subject', ''),
        new CompanyFilterTop('status', ''),
        new CompanyFilterTop('created_date', '')];
    searchText = "";
    customDateRange: string = null;
    startDate: string = null;
    endDate: string = null;
    constructor() {
        this.onInitUser();
    }
    public checkUse() {
        return this.selectedCompanies.length > 0 || (this.customDateRange || this.startDate && this.endDate) || this.selectedTechUsers.length > 0 || this.selectedUsers.length > 0 || this.selectedStatus.length > 0 || this.selectedPriorityLevels.length > 0 || this.tags.length > 0;
    }
    public clearDates() {
        this.startDate = null;
        this.endDate = null;
    }
    public setStartDate(data) {
        this.startDate = data;
    }
    public setEndDate(data) {
        this.endDate = data;
    }
    public setCustomStatus(data) {
        this.customStatus = data;
    }
    public setPriorityLevels(data) {
        this.selectedPriorityLevels = data;
    }
    public setSearchText(data) {
        this.searchText = data;
    }
    public setFilter(data) {
        this.tags = data.tags;
        this.selectedCompanies = data.selectedCompanies;
        this.selectedTechUsers = data.selectedTechUsers;
        this.selectedUsers = data.selectedUsers;
        this.selectedStatus = data.selectedStatus;
        this.selectedPriorityLevels = data.selectedPriorityLevels;
        this.customDateRange = data.customDateRange;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
    }
    public setStatus(data) {
        this.selectedStatus = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setCustomDateRange(data) {
        this.customDateRange = data;
    }
    public setCompanies(data) {
        this.selectedCompanies = data;
    }
    public setTechUsers(data) {
        this.selectedTechUsers = data;
    }
    public setUsers(data) {
        this.selectedUsers = data;
    }
    public setSortBy(data) {
        this.sortBy = data;
    }
    onFilter(field) {
        let index = this.filter.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filter[index].filter;
            if (field === 'created') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.sortBy = 'CREATED_BY_ASC';
                } else {
                    this.filter[index].filter = 'DESC';
                    this.sortBy = 'CREATED_BY_DESC';
                }
            }
            if (field === 'subject') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.sortBy = 'SUBJECT_ASC';

                } else {
                    this.filter[index].filter = 'DESC';
                    this.sortBy = 'SUBJECT_DESC';
                }
            }
            if (field === 'company') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.sortBy = 'COMPANY_NAME_ASC';
                } else {
                    this.filter[index].filter = 'DESC';
                    this.sortBy = 'COMPANY_NAME_DESC';
                }
            }
            if (field === 'status') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.sortBy = 'STATUS_ASC';
                } else {
                    this.filter[index].filter = 'DESC';
                    this.sortBy = 'STATUS_DESC';

                }
            }
            if (field === 'created_date') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.sortBy = 'CREATED_DATE_ASC';

                } else {
                    this.filter[index].filter = 'DESC';
                    this.sortBy = 'CREATED_DATE_DESC';
                }
            }
        }
    }
    private clearFilter() {
        this.filter.forEach(item => item.filter = '');
    }
    public getDataForCounts() {
        let data = {
            "ALL": this.getAllPayLoad(),
            "CLOSED": this.getClsoedPayLoad(),
            "ON_HOLD": this.getHoldPayLoad(),
            "OPEN": this.getOpenPayLoad(),
            "RECURRING_TICKETS_CLOSED": this.getRecurringTicketsClosedPayLoad(),
            "RECURRING_TICKETS_OPEN": this.getRecurringTicketsOpenPayLoad(),
            "SPAM": this.getSpamPayLoad(),
            "TRASH": this.getTrashPayLoad(),
            "UNASSIGNED": this.getUnassignedPayLoad(),
            "USER": this.getUserPayLoad()
        }
        data.RECURRING_TICKETS_CLOSED["offset"] = 0;
        data.RECURRING_TICKETS_OPEN["offset"] = 0;
        data.USER["offset"] = 0;
        return data;
    }
    public getDataForStatusCounts(ticketStatus: Array<TicketStatusFilter>) {
        let data = {
        }
        ticketStatus.forEach(item => {
            let status = (item.custom) ? item.title : item.title.toLocaleUpperCase().replace(" ", "_");
            data[status] = this.getFilterStatusPayload(item);
            if (this.selectedCompanies.length > 0) {
                data[status].groupFieldFilters.push({
                    fieldFilterDtos: [{
                        operator: "IN",
                        path: "company.id",
                        values: this.selectedCompanies.map(item => item.id)
                    }],

                })
            }
            if (this.selectedTechUsers.length > 0) {
                data[status].groupFieldFilters.push({
                    fieldFilterDtos: [{
                        "path": "assignedUser.id",
                        "operator": "IN",
                        "values": this.selectedTechUsers.map(item => item.id)
                    },
                    {
                        "path": "multiAssignedUsers.id",
                        "operator": "IN",
                        "values": this.selectedTechUsers.map(item => item.id)
                    }],
                    predicateRule: "OR"
                });
            }
            if (this.selectedUsers.length > 0) {
                data[status].groupFieldFilters.push({
                    fieldFilterDtos: [{
                        operator: "IN",
                        path: "createdUser.id",
                        values: this.selectedUsers.map(item => item.id)
                    }],

                })
            }
            if (this.tags.length > 0) {
                data[status].groupFieldFilters.push({
                    fieldFilterDtos: [{
                        operator: "IN",
                        path: "tags.id",
                        values: this.tags.map(item => item.id)
                    }],

                })
            }
            if (this.selectedPriorityLevels.length > 0) {
                data[status].groupFieldFilters.push({
                    fieldFilterDtos: [{
                        operator: "IN",
                        path: "priorityLevel.id",
                        values: this.selectedPriorityLevels.map(item => item.id)
                    }]
                })
            }
            if (this.customDateRange) data[status].customDateRange = this.customDateRange;
            if (this.startDate && this.endDate) {
                data[status].startDate = this.startDate;
                data[status].endDate = this.endDate;
            }
        });
        return data;
    }
    public setListType(type) {
        this.listType = type;
        if (this.listType === "ALL") this.onInitAll();
        if (this.listType === "UNASSIGNED") this.onInitUnassigned();
        if (this.listType === "OPEN" && !this.customStatus) this.onInitOpen();
        if (this.listType === "OPEN" && this.customStatus) this.onInitCustomOpen();
        if (this.listType === "CLOSED") this.onInitClosed();
        if (this.listType === "ON_HOLD") this.onInitOnhold();
        if (this.listType === "TRASH") this.onInitTrash();
        if (this.listType === "SPAM") this.onInitSpam();
        if (this.listType === "USERS") this.onInitUser();
        if (this.listType === "RECURRING_TICKETS_OPEN") this.onInitRecurringTicketsOpen();
        if (this.listType === "RECURRING_TICKETS_CLOSED") this.onInitRecurringTicketsClosed();
        if (this.listType === "COMPLETED") this.onInitCompleted();
        if (this.listType === "IN_PROGRESS") this.onInitInProgress();
    }
    public getListTupe() {
        if (this.listType === "RECURRING_TICKETS_OPEN") return "OPEN";
        if (this.listType === "RECURRING_TICKETS_CLOSED") return "CLOSED";
        return this.listType;
    }
    public setOffset(offset) {
        if (this.listType === "ALL") this.payloadAll.offset = offset;
        if (this.listType === "UNASSIGNED") this.payloadUnassigned.offset = offset;
        if (this.listType === "OPEN") this.payloadOpen.offset = offset;
        if (this.listType === "CLOSED") this.payloadClosed.offset = offset;
        if (this.listType === "ON_HOLD") this.payloadOnhold.offset = offset;
        if (this.listType === "TRASH") this.payloadTrash.offset = offset;
        if (this.listType === "SPAM") this.payloadSpam.offset = offset;
        if (this.listType === "USERS") this.payloadUser.offset = offset;
        if (this.listType === "RECURRING_TICKETS_OPEN") this.payloadRecurringTicketsOpen.offset = offset;
        if (this.listType === "RECURRING_TICKETS_CLOSED") this.payloadRecurringTicketsClosed.offset = offset;
        if (this.listType === "COMPLETED") this.payloadCompleted.offset = offset;
        if (this.listType === "IN_PROGRESS") this.payloadInProgress.offset = offset;

    }
    public setSize(size) {
        if (this.listType === "ALL") this.payloadAll.size = size;
        if (this.listType === "UNASSIGNED") this.payloadUnassigned.size = size;
        if (this.listType === "OPEN") this.payloadOpen.size = size;
        if (this.listType === "CLOSED") this.payloadClosed.size = size;
        if (this.listType === "ON_HOLD") this.payloadOnhold.size = size;
        if (this.listType === "TRASH") this.payloadTrash.size = size;
        if (this.listType === "SPAM") this.payloadSpam.size = size;
        if (this.listType === "USERS") this.payloadUser.size = size;
        if (this.listType === "RECURRING_TICKETS_OPEN") this.payloadRecurringTicketsOpen.size = size;
        if (this.listType === "RECURRING_TICKETS_CLOSED") this.payloadRecurringTicketsClosed.size = size;
        if (this.listType === "COMPLETED") this.payloadCompleted.size = size;
        if (this.listType === "IN_PROGRESS") this.payloadInProgress.size = size;
    }
    public getDataForRequest() {
        let payload = null;
        if (this.listType === "ALL") payload = JSON.parse(JSON.stringify(this.payloadAll));
        if (this.listType === "UNASSIGNED") payload = JSON.parse(JSON.stringify(this.payloadUnassigned));
        if (this.listType === "OPEN") payload = JSON.parse(JSON.stringify(this.payloadOpen));
        if (this.listType === "CLOSED") payload = JSON.parse(JSON.stringify(this.payloadClosed));
        if (this.listType === "ON_HOLD") payload = JSON.parse(JSON.stringify(this.payloadOnhold));
        if (this.listType === "TRASH") payload = JSON.parse(JSON.stringify(this.payloadTrash));
        if (this.listType === "SPAM") payload = JSON.parse(JSON.stringify(this.payloadSpam));
        if (this.listType === "USERS") payload = JSON.parse(JSON.stringify(this.payloadUser));
        if (this.listType === "RECURRING_TICKETS_OPEN") payload = JSON.parse(JSON.stringify(this.payloadRecurringTicketsOpen));
        if (this.listType === "RECURRING_TICKETS_CLOSED") payload = JSON.parse(JSON.stringify(this.payloadRecurringTicketsClosed));
        if (this.listType === "COMPLETED") payload = JSON.parse(JSON.stringify(this.payloadCompleted));
        if (this.listType === "IN_PROGRESS") payload = JSON.parse(JSON.stringify(this.payloadInProgress));
        if (this.selectedCompanies.length > 0) {
            payload.groupFieldFilters.push({
                fieldFilterDtos: [{
                    "operator": "IN",
                    path: "company.id",
                    values: this.selectedCompanies.map(item => item.id)
                }]
            })
        }
        if (this.selectedTechUsers.length > 0) {
            payload.groupFieldFilters.push({
                fieldFilterDtos: [{
                    "path": "assignedUser.id",
                    "operator": "IN",
                    "values": this.selectedTechUsers.map(item => item.id)
                },
                {
                    "path": "multiAssignedUsers.id",
                    "operator": "IN",
                    "values": this.selectedTechUsers.map(item => item.id)
                }],
                predicateRule: "OR"
            });
        }
        if (this.selectedStatus.length > 0) {
            let fieldFilterDtos = [];
            if (this.selectedStatus.filter(item => !item.custom).length > 0) fieldFilterDtos.push({
                "path": "status",
                "operator": "IN",
                "values": this.selectedStatus.filter(item => !item.custom).map(item => item.name.toLocaleUpperCase().replace(" ", "_"))
            })
            if (this.selectedStatus.filter(item => item.custom).length > 0) fieldFilterDtos.push({
                "path": "customStatus.id",
                "operator": "IN",
                "values": this.selectedStatus.filter(item => item.custom).map(item => item.id)
            })
            payload.groupFieldFilters.push({
                fieldFilterDtos: fieldFilterDtos,
                predicateRule: "OR"
            });
        }
        if (this.selectedUsers.length > 0) {
            payload.groupFieldFilters.push({
                fieldFilterDtos: [{
                    "operator": "IN",
                    "path": "createdUser.id",
                    "values": this.selectedUsers.map(item => item.id)

                }]
            })
        }
        if (this.tags.length > 0) {
            payload.groupFieldFilters.push({
                fieldFilterDtos: [{
                    operator: "IN",
                    path: "tags.id",
                    values: this.tags.map(item => item.id)
                }]
            })
        }
        if (this.selectedPriorityLevels.length > 0) {
            payload.groupFieldFilters.push({
                fieldFilterDtos: [{
                    operator: "IN",
                    path: "priorityLevel.id",
                    values: this.selectedPriorityLevels.map(item => item.id)
                }]
            })
        }
        if (this.sortBy) payload.sortBy = this.sortBy;
        if (this.searchText.length > 0) payload.searchText = this.searchText;
        if (this.customDateRange) payload.customDateRange = this.customDateRange;
        if (this.startDate && this.endDate) {
            payload.startDate = this.startDate;
            payload.endDate = this.endDate;
        }
        return payload;
    }

    public onInitAll() {
        this.payloadAll = this.getAllPayLoad();
        this.payloadAll.offset = 0;
    }
    public onInitUnassigned() {
        this.payloadUnassigned = this.getUnassignedPayLoad();
        this.payloadUnassigned.offset = 0;

    }
    public onInitOpen() {
        this.payloadOpen = this.getOpenPayLoad();
        this.payloadOpen.offset = 0;
    }
    public onInitCustomOpen() {
        this.payloadOpen = this.getCustomOpenPayLoad();
        this.payloadOpen.offset = 0;
    }
    public onInitClosed() {
        this.payloadClosed = this.getClsoedPayLoad();
        this.payloadClosed.offset = 0;

    }
    public onInitOnhold() {
        this.payloadOnhold = this.getHoldPayLoad();
        this.payloadOnhold.offset = 0;

    }
    public onInitTrash() {
        this.payloadTrash = this.getTrashPayLoad();
        this.payloadTrash.offset = 0;
    }
    public onInitRecurringTicketsOpen() {
        this.payloadRecurringTicketsOpen = this.getRecurringTicketsOpenPayLoad();
        this.payloadRecurringTicketsOpen.offset = 0;
    }
    public onInitRecurringTicketsClosed() {
        this.payloadRecurringTicketsClosed = this.getRecurringTicketsClosedPayLoad();
        this.payloadRecurringTicketsClosed.offset = 0;

    }
    public onInitUser() {
        this.payloadUser = this.getUserPayLoad();
        this.payloadUser.offset = 0;

    }
    public onInitSpam() {
        this.payloadSpam = this.getSpamPayLoad();
        this.payloadSpam.offset = 0;

    }
    public onInitCompleted() {
        this.payloadCompleted = this.getCompletedPayLoad();
        this.payloadCompleted.offset = 0;
    }
    public onInitInProgress() {
        this.payloadInProgress = this.getInProgressPayLoad();
        this.payloadInProgress.offset = 0;
    }
    private getAllPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            path: "ticketSource",
                            operator: "NOT_EQ",
                            values: [
                                "FROM_RECURRING_TICKET"
                            ]
                        }
                    ]
                }
            ]
        }
    }
    private getUnassignedPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            path: "status",
                            operator: "NULL"
                        }
                    ]
                },
                {
                    fieldFilterDtos: [
                        {
                            path: "reportedAsSpamAt",
                            operator: "NULL"
                        },
                        {
                            path: "markedAsSpamAt",
                            operator: "NULL"
                        },
                        {
                            path: "trash",
                            operator: "EQ",
                            values: [
                                false
                            ]
                        }
                    ],
                    predicateRule: "OR"
                }
            ]
        }
    }
    private getOpenPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    "fieldFilterDtos": [
                        {
                            "path": "ticketSource",
                            "operator": "NOT_EQ",
                            "values": [
                                "FROM_RECURRING_TICKET"
                            ]
                        }
                    ]
                },
                {
                    "fieldFilterDtos": [
                        {
                            "path": "status",
                            "operator": "NOT_EQ",
                            "values": [
                                "COMPLETED"
                            ]
                        },
                        {
                            "path": "status",
                            "operator": "NULL"
                        }
                    ],
                    "predicateRule": "OR"
                }
            ],
        }
    }
    public getFilterStatusPayload(item) {
        let status = (item.custom) ? item.id : item.title.toLocaleUpperCase().replace(" ", "_");
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            path: "ticketSource",
                            operator: "NOT_EQ",
                            values: [
                                "FROM_RECURRING_TICKET"
                            ]
                        }
                    ],
                },
                {
                    fieldFilterDtos: [
                        {
                            operator: "IN",
                            path: (!item.custom) ? "status" : "customStatus.id",
                            values: [
                                status
                            ]
                        },
                    ],
                }
            ]
        }
    }
    private getCustomOpenPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            operator: "EQ",
                            path: "status",
                            values: this.selectedStatus.map(item => item.name)
                        },
                        {
                            path: "ticketSource",
                            operator: "NOT_EQ",
                            values: [
                                "FROM_RECURRING_TICKET"
                            ]
                        }
                    ]
                }
            ]
        }
    }
    private getClsoedPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            path: "status",
                            operator: "EQ",
                            values: [
                                "COMPLETED"
                            ]
                        },
                        {
                            path: "ticketSource",
                            operator: "NOT_EQ",
                            values: [
                                "FROM_RECURRING_TICKET"
                            ]
                        }
                    ]
                }
            ],
        }
    }
    private getHoldPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            path: "status",
                            operator: "EQ",
                            values: [
                                "ON_HOLD"
                            ]
                        }
                    ]
                }
            ],
        }
    }
    private getTrashPayLoad() {
        return {
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            path: "trash",
                            operator: "EQ",
                            values: [
                                true
                            ]
                        }
                    ]
                }
            ],
        }
    }
    private getRecurringTicketsOpenPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            path: "status",
                            operator: "NOT_EQ",
                            values: [
                                "COMPLETED"
                            ]
                        },
                        {
                            path: "ticketSource",
                            operator: "EQ",
                            values: [
                                "FROM_RECURRING_TICKET"
                            ]
                        }
                    ]
                }
            ],
        }
    }
    private getRecurringTicketsClosedPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            path: "status",
                            operator: "EQ",
                            values: [
                                "COMPLETED"
                            ]
                        },
                        {
                            path: "ticketSource",
                            operator: "EQ",
                            values: [
                                "FROM_RECURRING_TICKET"
                            ]
                        }
                    ]
                }
            ],
        }
    }
    private getUserPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                    ]
                }
            ],
            myTicketsPage: true
        }
    }
    private getSpamPayLoad() {
        return {
            groupFieldFilters: [
                {
                    predicateRule: "OR",
                    fieldFilterDtos: [
                        {
                            path: "spamMarker",
                            operator: "NOT_NULL"
                        },
                        {
                            path: "spamReporter",
                            operator: "NOT_NULL"
                        }
                    ]
                }
            ],
        }
    }
    private getCompletedPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            operator: "EQ",
                            path: "status",
                            values: [
                                "COMPLETED"
                            ]
                        }
                    ]
                }
            ],
        };
    }
    private getInProgressPayLoad() {
        return {
            excludeTrashSpam: true,
            groupFieldFilters: [
                {
                    fieldFilterDtos: [
                        {
                            operator: "EQ",
                            path: "status",
                            values: [
                                "IN_PROGRESS"
                            ]
                        }
                    ]
                }
            ],

        };
    }
}