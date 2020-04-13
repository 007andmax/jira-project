export class TicketsFilter {
    listType: string = "ALL";
    payloadAll = {
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
    constructor() { }

    public getListTupe() {
        return this.listType;
    }
    public getDataForRequest() {
        if (this.listType === "ALL") return this.payloadAll;
    }
}