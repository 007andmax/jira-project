import { Company } from 'src/ng2/app/interfaces/company/company'
import { reqTicketsReport } from 'src/ng2/app/interfaces/reports/req-tickets-reports';
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

    companyName:string;
    public setData(data) {
        this.id = data.id;
        this.timeSpent = data.timeSpent;
        this.averageResponseTime = data.averageResponseTime;
        this.ticketsPerDate = data.ticketsPerDate.map(element => {
            return new TicketsPerDate(element);
        });
        this.tickets = data.tickets.map(element => {
            return new TicketsReportItem(element);
        });
       
        this.companyId = data.companyId;
        this.showTotalTicketAmount = data.showTotalTicketAmount;
        this.extendedReport = data.extendedReport;
        this.withResponseTime = data.withResponseTime;
        this.withTimeSpent = data.withTimeSpent;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.userId = data.userId;

    }
    public getForRequest() {
        let data: reqTicketsReport = {
            companyId: this.companyId,
            extendedReport: this.extendedReport,
            withResponseTime: this.withResponseTime,
            withTimeSpent: this.withTimeSpent,
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