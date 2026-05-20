export class TicketPreviewReportFilter {
    "page": number = 0;
    "size": number = 50;
    "sortBy": string = "desc";
    "ticketStatusIds": Array<string> = [];
    "dateFrom": string;
    "dateTo": string;
    constructor() {

    }
    public setDateFrom(data) {
        this.dateFrom = data;
    }
    public setDateTo(data) {
        this.dateTo = data;
    }
    public setTicketStatusIds(data) {
        this.ticketStatusIds = data;
    }
    public getDataForRequest() {
        return {
            "page": this.page,
            "size": this.size,
            "sortBy": this.sortBy,
            "ticketStatusIds": this.ticketStatusIds,
            "dateFrom": this.dateFrom,
            "dateTo": this.dateTo
        }
    }
}