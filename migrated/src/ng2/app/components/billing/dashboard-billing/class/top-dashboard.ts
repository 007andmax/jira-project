import { TopDashboardSum } from './top-dashboard-sum';

export class TopDashboard {
    top5InvoicesSum: Array<TopDashboardSum> = [];
    top5OutstandingInvoicesSum: Array<TopDashboardSum> = [];
    top5SellingProducts: Array<TopDashboardSum> = [];
    invoiceAmountsStartDate:string;
    invoiceAmountsEndDate:string;
    constructor() {
        
    }
    public setData(data) {
        this.top5InvoicesSum = data.top5InvoicesSum.map(item => new TopDashboardSum(item));
        this.top5OutstandingInvoicesSum = data.top5OutstandingInvoicesSum.map(item => new TopDashboardSum(item));
        this.top5SellingProducts = data.top5SellingProducts.map(item => new TopDashboardSum(item));
    }
    public getDataForRequest() {
        return {
            invoiceAmountsStartDate:this.invoiceAmountsStartDate,
            invoiceAmountsEndDate:this.invoiceAmountsEndDate
        }
    }
    public setInvoiceAmountsStartDate (data) {
        this.invoiceAmountsStartDate = data;
    }
    public setInvoiceAmountsEndDate (data) {
        this.invoiceAmountsEndDate = data;
    }
}