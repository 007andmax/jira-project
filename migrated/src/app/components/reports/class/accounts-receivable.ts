import { reqAccountsReceivable } from 'src/app/interfaces/reports/req-accounts-receivable';
import { AccountsReceivableItem } from './accounts-receivable-item';
import { AccountsReceivableLine } from './accounts-receivable-line';

export class AccountsReceivable {
    companyId: string;
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
    constructor() {

    }
    public setData(data) {
        this.companyId = data.companyId;
        this.techCompanyName = data.techCompanyName;
        this.clientCompanyName = data.clientCompanyName;
        this.type = data.type;
        this.totalCurrentSum = data.totalCurrentSum;
        this.total1MonthSum = data.total1MonthSum;
        this.total2MonthSum = data.total2MonthSum;
        this.total3MonthSum = data.total3MonthSum;
        this.totalOlderSum = data.totalOlderSum;
        this.totalSum = data.totalSum;
        this.lines = data.lines.map((item => {
            return new AccountsReceivableLine(item);
        }));
    }
    public getDataObject() {
        return {
            companyId: this.companyId,
            techCompanyName: this.techCompanyName,
            clientCompanyName: this.clientCompanyName,
            type: this.type,
            totalCurrentSum: this.totalCurrentSum,
            total1MonthSum: this.total1MonthSum,
            total2MonthSum: this.total2MonthSum,
            total3MonthSum: this.total3MonthSum,
            totalOlderSum: this.totalOlderSum,
            totalSum: this.totalSum,
            lines: this.lines
        }
    }
    public clearLines() {
        this.lines = [];
    }
    public setDataFromObject(data) {
        this.companyId = data.companyId;
        this.techCompanyName = data.techCompanyName;
        this.clientCompanyName = data.clientCompanyName;
        this.type = data.type;
        this.totalCurrentSum = data.totalCurrentSum;
        this.total1MonthSum = data.total1MonthSum;
        this.total2MonthSum = data.total2MonthSum;
        this.total3MonthSum = data.total3MonthSum;
        this.totalOlderSum = data.totalOlderSum;
        this.totalSum = data.totalSum;
        this.lines = data.lines;
    }
    public setLines(data) {
        this.lines = data;
    }
    public setClientCompanyId(data) {
        this.companyId = data;
    }
    public getForRequest() {
        let data: reqAccountsReceivable = {
            companyId: this.companyId
        }
        return data;
    }
}