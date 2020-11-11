export class DashboardSaleQuoteCounters {
    APPROVED: number;
    ARCHIVED: number;
    CANCELED: number;
    EXPIRED: number;
    INVOICED: number;
    TICKETED: number;
    READ:number;
    SAVED:number;
    UNREAD:number;

    
    constructor(data) {
        this.APPROVED = data.APPROVED;
        this.ARCHIVED = data.ARCHIVED;
        this.CANCELED = data.CANCELED;
        this.EXPIRED = data.EXPIRED;
        this.INVOICED = data.INVOICED;
        this.TICKETED = data.TICKETED;

        this.READ = data.READ;
        this.SAVED = data.SAVED;
        this.UNREAD = data.UNREAD;
    }
    public getTotal() {
        return ((this.APPROVED) ? this.APPROVED : 0) +
        ((this.ARCHIVED) ? this.ARCHIVED : 0) +
        ((this.CANCELED) ? this.CANCELED : 0) +
        ((this.EXPIRED) ? this.EXPIRED : 0) +
        ((this.INVOICED) ? this.INVOICED : 0) +
        ((this.TICKETED) ? this.TICKETED : 0) +
        ((this.READ) ? this.READ : 0) +
        ((this.SAVED) ? this.SAVED : 0) +
        ((this.UNREAD) ? this.UNREAD : 0);
    }
}