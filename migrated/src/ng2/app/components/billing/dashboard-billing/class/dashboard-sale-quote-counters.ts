export class DashboardSaleQuoteCounters {
    APPROVED: number = 0;
    ARCHIVED: number = 0;
    CANCELED: number = 0;
    EXPIRED: number = 0;
    INVOICED: number = 0;
    TICKETED: number = 0;
    READ:number = 0;
    SAVED:number = 0;
    UNREAD:number = 0;

    
    constructor(data = null) {
        if (data) {
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