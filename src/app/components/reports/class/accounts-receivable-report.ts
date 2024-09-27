import { AccountsReceivableReportLineReport } from "./accounts-receivable-report-line";

export class AccountsReceivableReport {
    totalCurrentSum: number;
    total1MonthSum: number;
    total2MonthSum: number;
    total3MonthSum: number;
    totalOlderSum: number;
    totalSum: number;
    clientCompanyName: string;
    invoiceNumber: string;
    lines: Array<AccountsReceivableReportLineReport> = [];
    constructor(data) {
        this.totalCurrentSum = data.totalCurrentSum;
        this.total1MonthSum = data.total1MonthSum;
        this.total2MonthSum = data.total2MonthSum;
        this.total3MonthSum = data.total3MonthSum;
        this.totalOlderSum = data.totalOlderSum;
        this.totalSum = data.totalSum;
        this.clientCompanyName = data.clientCompanyName;
        this.invoiceNumber = data.invoiceNumber;
    }
}