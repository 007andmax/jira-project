import { reqTicketsReport } from 'src/app/interfaces/reports/req-tickets-reports';
import { TitleListType } from '../../tickets/tickets/tickets-header/class/title-list-type';
import { TicketsReportItem } from './tickets-report-item';

export class TicketsReport {
    tickets: Array<TicketsReportItem> = [];
    startDate: string = '';
    endDate: string = '';
    userId: string;
    companySelectionType: Array<TitleListType> = [new TitleListType("ALL", "ALL"),
    new TitleListType("WITHOUT_DATA", "WITHOUT_DATA"),
    new TitleListType("WITH_DATA", "WITH_DATA")];
    selectedCompanySelectionType = new TitleListType("ALL", "ALL");

    public setData(data) {
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
            userId: this.userId,
            companySelectionType: this.selectedCompanySelectionType.type,
        }
        return data;
    }
    public setCompanySelectionType(data) {
        this.selectedCompanySelectionType = data;
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
    public resetDates() {
        this.startDate = '';
        this.endDate = '';
    }
}