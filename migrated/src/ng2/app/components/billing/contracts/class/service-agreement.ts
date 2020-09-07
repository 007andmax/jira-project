import { ContractsHourlyService } from '../contracts-aside/class/contracts-hourly-service';
import * as moment from "moment";
export class ServiceAgreement {
    amount: number;
    billType: any;
    blockRate: number;
    blockTimeServices: any;
    companyId: string;
    contractWithBlockTime: boolean;
    customBillingDate: any;
    customInterval: any;
    description: string;
    enableTimeRollover: boolean;
    endDate: number;
    glNumber: any;
    id: string;
    includedHours: number;
    interval: String;
    invoiceAsSingleItem: boolean;
    maxRolloverHours: any;
    productExpenses: any;
    rateExceeding: number;
    reviewDate: number;
    serviceContractServices: any;
    serviceContractServicesToTrack: any;
    serviceExpenses: any;
    services: Array<ContractsHourlyService> = [];
    shares: any;
    startDate: number;
    status: string;
    taxIds: Array<String> = [];
    type: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.services = data.services.map(item => {
                return new ContractsHourlyService(item.basedOnDefault, item.billable, item.commissionRate, item.id, item.name, item.rate, item.taxIds);
            })
        }
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
            //this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            //   this.endDate = moment(finalDate.getTime() + 86400000000 * 30 * 12 * 100).format('YYYY/MM/DD');
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            //   this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            //   this.endDate = moment(finalDate.getTime() + 86400000000 * 30 * 12 * 100).format('YYYY/MM/DD');
        }
    }
    public getDataForUpdate() {
        return {
            id:this.id,
            companyId: this.companyId,
            description: this.description,
            endDate: this.endDate,
            services: this.services,
            startDate: this.startDate,
            reviewDate:this.reviewDate,
            type: this.type
        }
    }
}