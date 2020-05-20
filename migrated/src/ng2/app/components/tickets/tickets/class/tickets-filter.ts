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
    payloadCompleted = null;
    payloadInProgress = null;
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
    public getDataForCounts() {
        let data = {
            "ALL": this.getAllPayLoad(),
            "CLOSED": this.getClsoedPayLoad(),
            "COMPLETED": this.getCompletedPayLoad(),
            "IN_PROGRESS": this.getInProgressPayLoad(),
            "ON_HOLD": this.getHoldPayLoad(),
            "OPEN": this.getOpenPayLoad(),
            "RECURRING_TICKETS_CLOSED":this.getRecurringTicketsClosedPayLoad(),
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
                values: this.tags.map(item => {
                    return item.id;
                })
            });
            payload.groupFieldFilters[0].predicateRule = "AND";
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
            ]
        }
    }
    private getClsoedPayLoad() {
        return  {
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
        return  {
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
        return  {
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
        return  {
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
        return  {
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
        return  {
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
            myTicketsPage: true
        }
    }
    private getSpamPayLoad() {
        return  {
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
        return  {
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
        } ;
    }
    private getInProgressPayLoad() {
        return  {
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
        
        } ;
    }
}