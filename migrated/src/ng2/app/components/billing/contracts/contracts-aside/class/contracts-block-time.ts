import { ContractsBlockTimeService } from './contracts-block-time-service';
import * as moment from "moment";
export class ContractsBlockTime {
    billType: any;
    blockRate: string;
    blockTimeServices: Array<ContractsBlockTimeService> = [];
    companyId: string;
    customInterval: any;
    description: string;
    enableTimeRollover: boolean;
    endDate: string;
    id: string;
    includedHours: string;
    intervalstring: any;
    rateExceeding: string;
    services: [];
    shares: [];
    startDate: string;
    taxIds: Array<string> = [];
    type: string;
    reviewDate: number;
    constructor() { }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setStartDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            //   this.endDate = moment(finalDate.getTime() + 86400000000 * 30 * 12 * 100).format('YYYY/MM/DD');
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            //   this.endDate = moment(finalDate.getTime() + 86400000000 * 30 * 12 * 100).format('YYYY/MM/DD');
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
}