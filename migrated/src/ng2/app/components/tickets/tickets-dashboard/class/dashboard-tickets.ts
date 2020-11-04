import { DashboardTicketsChartData } from './dashboard-tickets-chart-data';

export class DashboardTickets {
    chartData: Array<DashboardTicketsChartData> = [];
   
    constructor(data) {
        this.chartData = data.chartData.map(item => new DashboardTicketsChartData(item));
         
    }
}