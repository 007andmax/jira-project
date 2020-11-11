export class DashboardChartData {
    date: string;
    totalBillable: number;
    totalOverDue: number;
    totalReceivable: number;
    totalReceivableUnpaid: number;
    totalSales: number;
    constructor(data) {
        this.date = data.date;
        this.totalBillable = data.totalBillable;
        this.totalOverDue = data.totalOverDue;
        this.totalReceivable = data.totalReceivable;
        this.totalReceivableUnpaid = data.totalReceivableUnpaid;
        this.totalSales = data.totalSales;
    }
}