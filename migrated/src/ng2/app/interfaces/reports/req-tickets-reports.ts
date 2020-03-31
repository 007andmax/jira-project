import { Company } from '../company/company';

export interface reqTicketsReport {
    companyId: string;
    extendedReport: boolean;
    withResponseTime: boolean;
    withTimeSpent: boolean;
    showTotalTicketAmount:boolean;
    startDate: string;
    endDate: string;
    userId: string;

}