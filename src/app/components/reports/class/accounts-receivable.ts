import { AccountsReceivableReport } from "./accounts-receivable-report";



export class AccountsReceivable {
    companyIds: Array<string> = [];
    techCompanyName: string;
    clientCompanyName: string;
    type: string;
    totalCurrentSum: number;
    total1MonthSum: number;
    total2MonthSum: number;
    total3MonthSum: number;
    totalOlderSum: number;
    totalSum: number;
    isCommonReport: boolean = true;
    reportData: Array<AccountsReceivableReport> = [];
    constructor() {

    }
    public setData(data) {
        this.companyIds = data.companyIds;
        this.techCompanyName = data.techCompanyName;
        this.clientCompanyName = data.clientCompanyName;
        this.type = data.type;
        this.totalCurrentSum = data.totalCurrentSum;
        this.total1MonthSum = data.total1MonthSum;
        this.total2MonthSum = data.total2MonthSum;
        this.total3MonthSum = data.total3MonthSum;
        this.totalOlderSum = data.totalOlderSum;
        this.totalSum = data.totalSum;
        this.reportData = data.reportData.map((item => {
            return new AccountsReceivableReport(item);
        }));
    }
    public getDataObject() {
        return {
            companyIds: this.companyIds,
            techCompanyName: this.techCompanyName,
            clientCompanyName: this.clientCompanyName,
            type: this.type,
            totalCurrentSum: this.totalCurrentSum,
            total1MonthSum: this.total1MonthSum,
            total2MonthSum: this.total2MonthSum,
            total3MonthSum: this.total3MonthSum,
            totalOlderSum: this.totalOlderSum,
            totalSum: this.totalSum,
            reportData: this.reportData
        }
    }
    public clearLines() {
        this.reportData = [];
    }
    public setDataFromObject(data) {
        this.companyIds = data.companyIds;
        this.techCompanyName = data.techCompanyName;
        this.clientCompanyName = data.clientCompanyName;
        this.type = data.type;
        this.totalCurrentSum = data.totalCurrentSum;
        this.total1MonthSum = data.total1MonthSum;
        this.total2MonthSum = data.total2MonthSum;
        this.total3MonthSum = data.total3MonthSum;
        this.totalOlderSum = data.totalOlderSum;
        this.totalSum = data.totalSum;
        this.reportData = data.reportData;
    }
    public setLines(data) {
        this.reportData = data;
    }
    public setClientCompanyIds(data) {
        this.companyIds = data;
    }
    public getForRequest() {
        let data: any = {
            "isCommonReport": this.isCommonReport
        }
        if (this.companyIds.length > 0) data.companyIds = this.companyIds;
        return data;
    }
}