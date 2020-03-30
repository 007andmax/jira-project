import { Company } from 'src/ng2/app/interfaces/company/company'
import { reqTicketsReport } from 'src/ng2/app/interfaces/reports/req-tickets-reports';

export class TicektsReport {
    companyId: string;
    extendedReport: boolean;
    withResponseTime: boolean;
    withTimeSpent: boolean;
    startDate: string;
    endDate: string;
    userId:string;
    public setData(data) {
        this.companyId = data.companyId;
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