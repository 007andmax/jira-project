export class AccountsReceivableLine {
    currentSum: number;
    month1Sum: number;
    month2Sum: number;
    month3Sum: number;
    olderSum: number;
    totalSum: number;
    clientCompanyName: string;
    invoiceNumber:string;
    constructor(data) {
        this.currentSum =  data.currentSum;
        this.month1Sum =  data.month1Sum;
        this.month2Sum =  data.month2Sum;
        this.month3Sum =  data.month3Sum;
        this.olderSum =  data.olderSum;
        this.totalSum =  data.totalSum;
        this.clientCompanyName =  data.clientCompanyName;
        this.invoiceNumber =  data.invoiceNumber;
    }
}