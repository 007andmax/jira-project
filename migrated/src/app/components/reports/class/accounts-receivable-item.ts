import { AccountsReceivableLine } from './accounts-receivable-line';

export class AccountsReceivableItem {

    techCompanyName: string;
    clientCompanyName: string;
    type: string;
    totalCurrentSum: number;
    total1MonthSum: number;
    total2MonthSum: number;
    total3MonthSum: number;
    totalOlderSum: number;
    totalSum: number;
    lines: Array<AccountsReceivableLine> = [];
    constructor(data) {
        this.techCompanyName = data.techCompanyName;
        this.clientCompanyName = data.clientCompanyName;
        this.type = data.type;
        this.totalCurrentSum = data.totalCurrentSum;
        this.total1MonthSum = data.total1MonthSum;
        this.total2MonthSum = data.total2MonthSum;
        this.total3MonthSum = data.total3MonthSum;
        this.totalOlderSum = data.totalOlderSum;
        this.totalSum = data.totalSum;
        this.lines = data.line.map((item => {
            return new AccountsReceivableLine(item);
        }))
    }


}