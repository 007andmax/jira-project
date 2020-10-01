import * as moment from "moment";
import { ServiceAgreement } from '../../class/service-agreement';
import { ContractsHourlyService } from './contracts-hourly-service';
import { DefaultServicesHourlyContract } from './default-service-hourly-contract';
export class ContractsHourly {
    companyId: string;
    description: string = "";
    endDate: string;
    services: Array<ContractsHourlyService> = [];
    startDate: string;
    type: string = "HOURLY";
    reviewDate: number;
    constructor() {


    }
    public setDataFromCopy(data:ServiceAgreement) {
        this.companyId = data.companyId;
        this.description = data.description;
        this.endDate  = data.endDate;
        this.services = data.services;
        this.startDate = data.startDate;
        this.type = data.type;
        this.reviewDate = new Date(data.reviewDate).getTime();
    }
    public getDataForCreate() {
        return {
            companyId: this.companyId,
            description: this.description,
            endDate: this.endDate,
            services: this.services.map(item => item.getDataForCreate()),
            startDate: this.startDate,
            reviewDate:this.reviewDate,
            type: this.type
        }
    }
    public onAddServices(defaultServices: Array<DefaultServicesHourlyContract>) {
        this.services = [];
        defaultServices.forEach(item => {
            console.log("item",item);
            if (item.selected) this.services.push(new ContractsHourlyService(true, item.billable, item.commissionRate, item.versionedId.id, item.name, item.rate, item.taxes.map(tax => tax.id)));
        })
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setReviewDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.reviewDate = finalDate.getTime();
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.reviewDate = finalDate.getTime()
        }
    }
    public setStartDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            let endDate = new Date(finalDate.getTime());
            endDate.setFullYear(endDate.getFullYear() + 10);
            this.endDate = moment(endDate).format('YYYY/MM/DD');
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            let endDate = new Date(finalDate.getTime());
            endDate.setFullYear(endDate.getFullYear() + 10);
            this.endDate = moment(endDate).format('YYYY/MM/DD');
        }
    }
}