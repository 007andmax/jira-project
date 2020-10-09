export class DashboardSaleQuoteCounters {
    APPROVED: number;
    ARCHIVED: number;
    CANCELED: number;
    EXPIRED: number;
    INVOICED: number;
    TICKETED: number;
    constructor(data) {
        this.APPROVED = data.APPROVED;
        this.ARCHIVED = data.ARCHIVED;
        this.CANCELED = data.CANCELED;
        this.EXPIRED = data.EXPIRED;
        this.INVOICED = data.INVOICED;
        this.TICKETED = data.TICKETED;
    }
}