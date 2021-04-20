export class DashboardChartData {
    date: string;
    totalBillable: number;
    totalOverDue: number;
    totalIncomeAmount: number;
    totalCustomerDebt: number;
    totalSales: number;
    constructor(data) {
        this.date = data.date;
        this.totalBillable = data.totalBillable;
        this.totalOverDue = data.totalOverDue;
        this.totalIncomeAmount = data.totalIncomeAmount;
        this.totalCustomerDebt = data.totalCustomerDebt;
        this.totalSales = data.totalSales;
    }
}