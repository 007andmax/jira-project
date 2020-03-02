export class TaxesReportLine {
    invoiceId: string;
    invoiceNumber: string;
    date: string;
    invoiceSum: number;
    taxes: any;
    name: string;
    taxableSum: number;
    taxSum: number;
    constructor(data) {
  
        this.invoiceId = data.invoiceId;
        this.invoiceNumber = data.invoiceNumber;
        this.date = data.date;
        this.invoiceSum = data.invoiceSum;
        this.taxes = data.taxes;
        this.name = data.name;
        this.taxableSum = data.taxableSum;
        this.taxSum = data.taxSum;
    }
} 