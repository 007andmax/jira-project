import { ServiceReportsItem } from './service-reports-item';
import * as moment from "moment";
import { reqServiceReport } from 'src/ng2/app/interfaces/reports/req-service-reports';

export class ServiceReports {

    companyId: string;
    startDate: string = '';
    endDate: string = '';
    services: Array<ServiceReportsItem> = [];
    companyName:string;

    public setData(data) {
        this.services = data.map(item => {
            return new ServiceReportsItem(item);
        })
    }
    public getForRequest() {
        let data: reqServiceReport = {
            companyId: this.companyId,
            startDate: this.startDate,
            endDate: this.endDate,
        }
        return data;

    }
    public setDataFromObject(data) {
        this.companyId = data.companyId;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.services = data.services;
    }
    public getDataObject() {
        return {
            companyId: this.companyId,
            startDate: this.startDate,
            endDate: this.endDate,
            services: this.services
        }
    }
    public setDatesByCompany(selectedClient) {
        this.setStartDate(moment(selectedClient.createdAt).format('YYYY/MM/DD'));
        this.setEndDate(moment(new Date()).format('YYYY/MM/DD'));
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