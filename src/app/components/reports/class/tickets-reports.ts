import { Company } from 'src/app/interfaces/company/company'
import { reqTicketsReport } from 'src/app/interfaces/reports/req-tickets-reports';
import * as moment from "moment";
import { TicketsPerDate } from '../reports/ticket-report/class/tickets-per-date';
import { TicketsReportItem } from './tickets-report-item';

export class TicketsReport {
    id: string;
    timeSpent: any;
    averageResponseTime: number;
    ticketsPerDate: Array<TicketsPerDate> = [];
    tickets: Array<TicketsReportItem> = [];
    companyId: string;
    extendedReport: boolean = true;
    withResponseTime: boolean = true;
    withTimeSpent: boolean = true;
    showTotalTicketAmount: boolean = true;

    startDate: string = '';
    endDate: string = '';
    userId: string;

    companyName: string;
    public setData(data) {
        console.log("data", data);


        this.tickets = data.tickets;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.userId = data.userId;

    }
    public getDate() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
            userId: this.userId,
            tickets: this.tickets
        }
    }
    public setTickets(data) {
        this.tickets = data.map(item => new TicketsReportItem(item));
    }
    public getForRequest() {
        let data: reqTicketsReport = {
            startDate: this.startDate,
            endDate: this.endDate,
            userId: this.userId
        }
        return data;
    }
    public setDatesByCompany(selectedClient) {
        this.setStartDate(moment(selectedClient.createdAt).format('YYYY/MM/DD'));
        this.setEndDate(moment(new Date()).format('YYYY/MM/DD'));
    }
    public setTechUser(userId) {
        this.userId = userId;
    }
    public setStartDate(startDate) {
        this.startDate = startDate;
    };
    public setEndDate(endDate) {
        this.endDate = endDate;
    };
    public setCompanyId(data) {
        this.companyId = data;
    }
    public resetDates() {
        this.startDate = '';
        this.endDate = '';
    }
}