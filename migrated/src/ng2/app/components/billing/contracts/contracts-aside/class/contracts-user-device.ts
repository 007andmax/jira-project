import { ContractsBlockTimeService } from './contracts-block-time-service';
import { ContractsUserDeviceService } from './contracts-user-device-service';
import * as moment from "moment";

export class ContractsUserDevice {
    billType: string;
    blockTimeServices: any;
    companyId: string;
    contractWithBlockTime: boolean;
    customInterval: any;
    description: string;
    endDate:string;
    id: string;
    includedHours: any;
    interval: string;
    intervalstring:string;
    invoiceAsSingleItem: boolean;
    productExpenses: any;
    rateExceeding: any;
    serviceContractServices: Array<ContractsUserDeviceService> = [];
    serviceContractServicesToTrack: Array<ContractsBlockTimeService> = [];
    serviceExpenses: any;
    services: any;
    startDate: string;
    reviewDate:string;
    taxIds: any;
    type: string = "SERVICE_CONTRACT";
    constructor() {

    }
    public setInterval(data) {
        this.intervalstring = data;
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setStartDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            this.calculateEndDate();
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            this.calculateEndDate();
        }

    }
    public setReviewDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.reviewDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.reviewDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
        }
    }
    public calculateEndDate() {
        if (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') {
            let endDate = new Date(this.startDate);
            endDate.setFullYear(endDate.getFullYear() + 50);
            endDate.setDate(endDate.getDate() - 1);
            this.endDate = moment(endDate).format('YYYY/MM/DD');

        } else if (this.intervalstring === '30 days') {
            let endDate = new Date(this.startDate);
            endDate.setDate(endDate.getDate() + 29 * 12 * 50);
            endDate.setDate(endDate.getDate() - 1);
            this.endDate = moment(endDate).format('YYYY/MM/DD');

        } else if (this.intervalstring === '15 days') {
            let endDate = new Date(this.startDate);
            endDate.setDate(endDate.getDate() + 28 * 12 * 50);
            endDate.setDate(endDate.getDate() - 1);
            this.endDate = moment(endDate).format('YYYY/MM/DD');

        } else if (this.intervalstring === '7 days') {
            let endDate = new Date(this.startDate);
            endDate.setFullYear(endDate.getFullYear() + 50);
            endDate.setDate(endDate.getDate() - 7);
            //   endDate.setDate(endDate.getDate() - 1);
            this.endDate = moment(endDate).format('YYYY/MM/DD');

        }
    }
}