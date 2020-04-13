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
    constructor() {
        this.onInitUser();
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
        if (this.listType === "ALL")  this.payloadAll.offset = offset;
        if (this.listType === "UNASSIGNED")  this.payloadUnassigned.offset = offset;
        if (this.listType === "OPEN")  this.payloadOpen.offset = offset;
        if (this.listType === "CLOSED")  this.payloadClosed.offset = offset;
        if (this.listType === "ON_HOLD")  this.payloadOnhold.offset = offset;
        if (this.listType === "TRASH")  this.payloadTrash.offset = offset;
        if (this.listType === "SPAM")  this.payloadSpam.offset = offset;
        if (this.listType === "USERS")  this.payloadUser.offset = offset;
        if (this.listType === "RECURRING_TICKETS_OPEN")  this.payloadRecurringTicketsOpen.offset = offset;
        if (this.listType === "RECURRING_TICKETS_CLOSED")  this.payloadRecurringTicketsClosed.offset = offset;
       
    }
    public getDataForRequest() {
        if (this.listType === "ALL") return this.payloadAll;
        if (this.listType === "UNASSIGNED") return this.payloadUnassigned;
        if (this.listType === "OPEN") return this.payloadOpen;
        if (this.listType === "CLOSED") return this.payloadClosed;
        if (this.listType === "ON_HOLD") return this.payloadOnhold;
        if (this.listType === "TRASH") return this.payloadTrash;
        if (this.listType === "SPAM") return this.payloadSpam;
        if (this.listType === "USERS") return this.payloadUser;
        if (this.listType === "RECURRING_TICKETS_OPEN") return this.payloadRecurringTicketsOpen;
        if (this.listType === "RECURRING_TICKETS_CLOSED") return this.payloadRecurringTicketsClosed;

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