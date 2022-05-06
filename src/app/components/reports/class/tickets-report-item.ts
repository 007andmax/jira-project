export class TicketsReportItem {
    companyName: string;
    quantityClosed: number;
    quantityCreated: number;
    quantityFromAgent: number;
    quantityFromEmail: number;
    quantityFromWeb: number;
    constructor(data) {
        if (data) {
            this.companyName = data.companyName;
            this.quantityClosed = data.quantityClosed;
            this.quantityCreated = data.quantityCreated;
            this.quantityFromAgent = data.quantityFromAgent;
            this.quantityFromEmail = data.quantityFromEmail;
            this.quantityFromWeb = data.quantityFromWeb;
        }
    }
}