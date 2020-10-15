import { DashboardTicketsChartData } from './dashboard-tickets-chart-data';

export class DashboardTickets {
    chartData: Array<DashboardTicketsChartData> = [];
    onHoldTickets: number;
    openTickets: number;
    totalTickets: number;
    constructor(data) {
        
        this.chartData = data.chartData.map(item => new DashboardTicketsChartData(item));
       
        this.onHoldTickets = data.onHoldTickets;
        this.openTickets = data.openTickets;
        this.totalTickets = data.totalTickets;
        
    }
    
}