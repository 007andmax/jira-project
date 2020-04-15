import { Company } from 'src/ng2/app/interfaces/company/company';
import { User } from '../../../users/class/user';

export class TicketsFilter {
    listType: string = "USERS";
    title: string = "All Tickets";
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
    tags = [];
    selectedCompany: Company = null;
    selectedTechUser: User = null;
    selectedUser: User = null;
    constructor() {
        this.onInitUser();
    }
    public setTags(data) {
        this.tags = data;
    }
    public setCompany(data) {
        this.selectedCompany = data;
    }
    public setTechUser(data) {
        this.selectedTechUser = data;
    }
    public setUser(data) {
        this.selectedUser = data;
    }
    public setListType(type) {
        this.listType = type;
        if (this.listType === "ALL") this.onInitAll();
        if (this.listType === "UNASSIGNED") this.onInitUnassigned();
        if (this.listType === "OPEN") this.onInitOpen();
        if (this.listType === "CLOSED") this.onInitClosed();
        if (this.listType === "ON_HOLD") this.onInitOnhold();
        if (this.listType === "TRASH") this.onInitTrash();
        if (this.listType === "SPAM") this.onInitSpam();
        if (this.listType === "USERS") this.onInitUser();
        if (this.listType === "RECURRING_TICKETS_OPEN") this.onInitRecurringTicketsOpen();
        if (this.listType === "RECURRING_TICKETS_CLOSED") this.onInitRecurringTicketsClosed();
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
        if (this.listType === "USERS")  payload = JSON.parse(JSON.stringify(this.payloadUser));
        if (this.listType === "RECURRING_TICKETS_OPEN") payload = JSON.parse(JSON.stringify(this.payloadRecurringTicketsOpen));   
        if (this.listType === "RECURRING_TICKETS_CLOSED") payload = JSON.parse(JSON.stringify(this.payloadRecurringTicketsClosed));  
        if (this.selectedCompany) {
            payload.groupFieldFilters[0].fieldFilterDtos.push({
                operator: "EQ",
                path: "companyId",
                values: [this.selectedCompany.id]
            });
            payload.groupFieldFilters[0].predicateRule = "AND";

        }
        if (this.selectedTechUser) {
            payload.groupFieldFilters[0].fieldFilterDtos.push({
                operator: "EQ",
                path: "assignedUser.id",
                values: [this.selectedTechUser.id]
            });
            payload.groupFieldFilters[0].predicateRule = "AND";
        }
        if (this.selectedUser) {
            console.log("selectedUser",this.selectedUser);
            payload.groupFieldFilters[0].fieldFilterDtos.push({
                operator: "EQ",
                path: "createdUserId",
                values: [this.selectedUser.id]
            });
            payload.groupFieldFilters[0].predicateRule = "AND";
        }
        if (this.tags.length > 0) {
            payload.groupFieldFilters[0].fieldFilterDtos.push({
                operator: "IN",
                path: "tags.id",
                values: this.tags.map(item =>  {
                    return item.id;
                })
            });
            payload.groupFieldFilters[0].predicateRule = "AND";
        }
        return payload;
    }

    public onInitAll() {
        this.payloadAll = {
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
            ],
            offset: 0
        };
    }
    public onInitUnassigned() {
        this.payloadUnassigned = {
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
            ],
            offset: 0
        }
            ;
    }
    public onInitOpen() {
        this.payloadOpen = {
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
                            operator: "NOT_EQ",
                            values: [
                                "FROM_RECURRING_TICKET"
                            ]
                        }
                    ]
                }
            ],
            offset: 0
        }
            ;
    }
    public onInitClosed() {
        this.payloadClosed = {
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
            offset: 0
        }
            ;
    }
    public onInitOnhold() {
        this.payloadOnhold = {
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
            offset: 0
        }
            ;
    }
    public onInitTrash() {
        this.payloadTrash = {
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
            offset: 0
        }
            ;
    }
    public onInitRecurringTicketsOpen() {
        this.payloadRecurringTicketsOpen = {
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
            offset: 0
        }
            ;
    }
    public onInitRecurringTicketsClosed() {
        this.payloadRecurringTicketsClosed = {
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
            offset: 0
        }
            ;
    }
    public onInitUser() {
        this.payloadUser = {
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
            ],
            offset: 0,
            myTicketsPage: true
        }
            ;
    }
    public onInitSpam() {
        this.payloadSpam = {
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
            offset: 0
        }
            ;
    }
}