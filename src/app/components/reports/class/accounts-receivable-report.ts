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
        for (const key in data) {
            this[key] = data[key];
        }
        this.lines = [];
        if (data.lines) this.lines = data.lines.map(item => new AccountsReceivableReportLineReport(item));
    }
}