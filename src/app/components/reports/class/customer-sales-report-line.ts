export class CustomerSalesReportLine {
    totalSum: number;
    companyName: string;
    productsSum: number;
    servicesSum: number;
    date: string;
    invoiceNumber: string;
    itemName: string;
    serial: string;
    quantity: number;
    sale: number;
    discountAmount: number;
    constructor(data) {

        this.totalSum = data.totalSum;
        this.companyName = data.companyName;
        this.productsSum = data.productsSum;
        this.servicesSum = data.servicesSum;
        this.date = data.date;
        this.invoiceNumber = data.invoiceNumber;
        this.itemName = data.itemName;
        this.serial = data.serial;
        this.quantity = data.quantity;
        this.sale = data.sale;
        this.discountAmount = data.discountAmount;

    }
}