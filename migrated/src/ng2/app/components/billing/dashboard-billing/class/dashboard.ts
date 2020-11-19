import { DashboardChartData } from './dashboard-chart-data';
import { DashboardSaleQuoteCounters } from './dashboard-sale-quote-counters';

export class Dashboard {
    chartData: Array<DashboardChartData> = [];
    saleQuoteCounters: DashboardSaleQuoteCounters = new DashboardSaleQuoteCounters();
    saleQuotesPossibleRevenue: number;
    serviceAgreementCounters: {CURRENT: 2}
    totalBillable: number = 0;
    totalOverDue: number = 0;
    totalReceivable: number = 0;
    totalReceivableUnpaid: number = 0;
    totalSales: number = 0;
    constructor(data = null) {
        if (data) {
            this.chartData = data.chartData.map(item => new DashboardChartData(item));
            this.saleQuoteCounters = new DashboardSaleQuoteCounters(data.saleQuoteCounters);
            this.saleQuotesPossibleRevenue = data.saleQuotesPossibleRevenue;
            this.serviceAgreementCounters = data.serviceAgreementCounters;
            this.totalBillable = data.totalBillable;
            this.totalOverDue = data.totalOverDue;
            this.totalReceivable = data.totalReceivable;
            this.totalReceivableUnpaid = data.totalReceivableUnpaid;
            this.totalSales = data.totalSales;
        }
       
    }
    
}