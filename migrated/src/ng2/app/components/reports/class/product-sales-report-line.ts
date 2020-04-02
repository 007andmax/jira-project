export class ProductSalesReportLine {
    date: string;
    client: string;
    mfg: string;
    description: string;
    ticketNumber: string;
    invoiceNumber: string;
    serialNumber: string;
    purchaseCost: number;
    salePrice: number;
    discount: number;
    constructor(data) {
        this.date = data.date;
        this.client = data.client;
        this.mfg = data.mfg;
        this.description = data.description;
        this.ticketNumber = data.ticketNumber;
        this.invoiceNumber = data.invoiceNumber;
        this.serialNumber = data.serialNumber;
        this.purchaseCost = data.purchaseCost;
        this.salePrice = data.salePrice;
        this.discount = data.discount;
    }

 
}