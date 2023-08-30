import * as moment from 'moment';
import { TicketsPriority } from 'src/app/components/setting/ticket-settings-page/tickets-priority/class/tickets-priority';

export class DashboardTicketsStats {
    startDate: string;
    endDate: string;
    CLOSED: number;
    HIGH: number;
    LOW: number;
    MEDIUM: number;
    ON_HOLD: number;
    OPEN: number;
    RECURRING_TICKETS: number;
    RECURRING_TICKETS_CLOSED: number;
    RECURRING_TICKETS_OPEN: number;
    UNASSIGNED: number;
    counts: any = {};
    constructor() {
        let startDate = new Date();
        let endDate = new Date();
        startDate.setDate(1);
        startDate.setMonth(startDate.getMonth() - 1);
        endDate.setMonth(endDate.getMonth() - 1);
        let lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
        endDate.setDate(lastDayOfMonth);
        this.startDate = moment(startDate).format('YYYY-MM-DD');
        this.endDate = moment(endDate).format('YYYY-MM-DD');
    }
    public onSetDates(value) {
        let startDate = new Date();
        let endDate = new Date();
        if (value === "YEAR_TO_DATE") {
            startDate = new Date(startDate.getFullYear(), 0, 1);
            this.startDate = moment(startDate).format('YYYY-MM-DD');
            this.endDate = moment(endDate).format('YYYY-MM-DD');
        }
        if (value === "CURRENT_MONTH") {
            startDate.setDate(1);
            let lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
            endDate.setDate(lastDayOfMonth);
            this.startDate = moment(startDate).format('YYYY-MM-DD');
            this.endDate = moment(endDate).format('YYYY-MM-DD');
        }
        if (value === "LAST_MONTH") {
            startDate.setDate(1);
            startDate.setMonth(startDate.getMonth() - 1);
            endDate.setMonth(endDate.getMonth() - 1);
            let lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
            endDate.setDate(lastDayOfMonth);
            this.startDate = moment(startDate).format('YYYY-MM-DD');
            this.endDate = moment(endDate).format('YYYY-MM-DD');
        }
    }
    public setData(data, ticketsPriorities: Array<TicketsPriority>) {
        this.CLOSED = data.CLOSED;
        this.counts = data;
        ticketsPriorities.forEach(item => {
            let priority = item.name.toLocaleUpperCase().replace(" ", "_");
            this.counts[priority] = data[priority];
        });
        /*  this.HIGH = data.HIGH;
          this.LOW = data.LOW;
          this.MEDIUM = data.MEDIUM;*/
        this.ON_HOLD = data.ON_HOLD;
        this.OPEN = data.OPEN;
        this.RECURRING_TICKETS = data.RECURRING_TICKETS;
        this.RECURRING_TICKETS_CLOSED = data.RECURRING_TICKETS_CLOSED;
        this.RECURRING_TICKETS_OPEN = data.RECURRING_TICKETS_OPEN;
        this.UNASSIGNED = data.UNASSIGNED;
    }
    public getDataForPriorityCounts(ticketsPriorities: Array<TicketsPriority>) {
        let data = {
        }
        ticketsPriorities.forEach(item => {
            let priority = item.name.toLocaleUpperCase().replace(" ", "_");
            data[priority] = this.getPriorityLevalPayload(item.id)
        });
        return data;
    }
    public getPriorityLevalPayload(id) {
        return {
            "excludeTrashSpam": true,
            "groupFieldFilters": [
                {
                    "fieldFilterDtos": [
                        {
                            "path": "priorityLevel.id",
                            "operator": "EQ",
                            "values": [
                                id
                            ]
                        },
                        {
                            "path": "ticketSource",
                            "operator": "NOT_EQ",
                            "values": [
                                "FROM_RECURRING_TICKET"
                            ]
                        },
                    ]
                }
            ]
        }
    }
    public getDataForRequest() {
        return {
            "CLOSED": {
                "excludeTrashSpam": true,
                "groupFieldFilters": [
                    {
                        "fieldFilterDtos": [
                            {
                                "path": "status",
                                "operator": "EQ",
                                "values": [
                                    "COMPLETED"
                                ]
                            },
                            {
                                "path": "ticketSource",
                                "operator": "NOT_EQ",
                                "values": [
                                    "FROM_RECURRING_TICKET"
                                ]
                            },
                            {
                                "path": "closedAt",
                                "operator": "GT",
                                "values": [
                                    this.startDate
                                ]
                            },
                            {
                                "path": "closedAt",
                                "operator": "LT",
                                "values": [
                                    this.endDate
                                ]
                            }
                        ]
                    }
                ]
            },
            "ON_HOLD": {
                "excludeTrashSpam": true,
                "groupFieldFilters": [
                    {
                        "fieldFilterDtos": [
                            {
                                "path": "status",
                                "operator": "EQ",
                                "values": [
                                    "ON_HOLD"
                                ]
                            },
                            {
                                "path": "createdAt",
                                "operator": "GT",
                                "values": [
                                    this.startDate
                                ]
                            },
                            {
                                "path": "createdAt",
                                "operator": "LT",
                                "values": [
                                    this.endDate
                                ]
                            },
                            {
                                "path": "ticketSource",
                                "operator": "NOT_EQ",
                                "values": [
                                    "FROM_RECURRING_TICKET"
                                ]
                            },
                        ]
                    }
                ]
            },
            "OPEN": {
                "excludeTrashSpam": true,
                "groupFieldFilters": [
                    {
                        "fieldFilterDtos": [
                            {
                                "operator": "EQ",
                                "path": "status",
                                "values": [
                                    "IN_PROGRESS"
                                ]
                            },
                            {
                                "path": "createdAt",
                                "operator": "GT",
                                "values": [
                                    this.startDate
                                ]
                            },
                            {
                                "path": "createdAt",
                                "operator": "LT",
                                "values": [
                                    this.endDate
                                ]
                            },
                            {
                                "path": "ticketSource",
                                "operator": "NOT_EQ",
                                "values": [
                                    "FROM_RECURRING_TICKET"
                                ]
                            },
                        ]
                    }
                ]
            },
            "RECURRING_TICKETS": {
                "excludeTrashSpam": true,
                "groupFieldFilters": [
                    {
                        "fieldFilterDtos": [
                            {
                                "path": "ticketSource",
                                "operator": "EQ",
                                "values": [
                                    "FROM_RECURRING_TICKET"
                                ]
                            },
                            {
                                "path": "createdAt",
                                "operator": "GT",
                                "values": [
                                    this.startDate
                                ]
                            },
                            {
                                "path": "createdAt",
                                "operator": "LT",
                                "values": [
                                    this.endDate
                                ]
                            }
                        ]
                    }
                ],
                "offset": 0
            },
            "UNASSIGNED": {
                "excludeTrashSpam": true,
                "groupFieldFilters": [
                    {
                        "fieldFilterDtos": [
                            {
                                "path": "status",
                                "operator": "NULL"
                            },
                            {
                                "path": "createdAt",
                                "operator": "GT",
                                "values": [
                                    this.startDate
                                ]
                            },
                            {
                                "path": "createdAt",
                                "operator": "LT",
                                "values": [
                                    this.endDate
                                ]
                            },
                            {
                                "path": "ticketSource",
                                "operator": "NOT_EQ",
                                "values": [
                                    "FROM_RECURRING_TICKET"
                                ]
                            },
                        ]
                    },
                    {
                        "fieldFilterDtos": [
                            {
                                "path": "reportedAsSpamAt",
                                "operator": "NULL"
                            },
                            {
                                "path": "markedAsSpamAt",
                                "operator": "NULL"
                            },
                            {
                                "path": "trash",
                                "operator": "EQ",
                                "values": [
                                    false
                                ]
                            },
                        ],
                        "predicateRule": "OR"
                    }
                ]
            },
            "RECURRING_TICKETS_CLOSED": {
                "excludeTrashSpam": true,
                "groupFieldFilters": [
                    {
                        "fieldFilterDtos": [
                            {
                                "path": "status",
                                "operator": "EQ",
                                "values": [
                                    "COMPLETED"
                                ]
                            },
                            {
                                "path": "ticketSource",
                                "operator": "EQ",
                                "values": [
                                    "FROM_RECURRING_TICKET"
                                ]
                            }
                        ]
                    }
                ],
                "offset": 0
            },
            "RECURRING_TICKETS_OPEN": {
                "excludeTrashSpam": true,
                "groupFieldFilters": [
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
                                "path": "ticketSource",
                                "operator": "EQ",
                                "values": [
                                    "FROM_RECURRING_TICKET"
                                ]
                            }
                        ]
                    }
                ],
                "offset": 0
            },
            "MEDIUM": {
                "excludeTrashSpam": true,
                "groupFieldFilters": [
                    {
                        "fieldFilterDtos": [
                            {
                                "path": "priorityLevel",
                                "operator": "EQ",
                                "values": [
                                    "MEDIUM"
                                ]
                            },
                            {
                                "path": "ticketSource",
                                "operator": "NOT_EQ",
                                "values": [
                                    "FROM_RECURRING_TICKET"
                                ]
                            },
                        ]
                    }
                ]
            },
            "HIGH": {
                "excludeTrashSpam": true,
                "groupFieldFilters": [
                    {
                        "fieldFilterDtos": [
                            {
                                "path": "priorityLevel",
                                "operator": "EQ",
                                "values": [
                                    "HIGH"
                                ]
                            },
                            {
                                "path": "ticketSource",
                                "operator": "NOT_EQ",
                                "values": [
                                    "FROM_RECURRING_TICKET"
                                ]
                            },
                        ]
                    }
                ]
            },
            "LOW": {
                "excludeTrashSpam": true,
                "groupFieldFilters": [
                    {
                        "fieldFilterDtos": [
                            {
                                "path": "priorityLevel",
                                "operator": "EQ",
                                "values": [
                                    "LOW"
                                ]
                            },
                            {
                                "path": "ticketSource",
                                "operator": "NOT_EQ",
                                "values": [
                                    "FROM_RECURRING_TICKET"
                                ]
                            },
                        ]
                    }
                ]
            }
        }
    }
}