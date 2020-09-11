import { ContractsBlockTimeService } from './contracts-block-time-service';
import * as moment from "moment";
import { ContractsBlockTimeDefaultService } from './contracts-block-time-default-service';
export class ContractsBlockTime {
    billType: any;
    blockRate: string = "0";
    blockTimeServices: Array<ContractsBlockTimeService> = [new ContractsBlockTimeService("On site block time service", 5),
    new ContractsBlockTimeService("Remote block time service", 5)];
    companyId: string;
    customInterval: any;
    description: string;
    enableTimeRollover: boolean;
    endDate: string;
    id: string;
    includedHours: string = "";
    maxRolloverHours: string = "";
    intervalstring: any;
    rateExceeding: string = "0";
    services: Array<ContractsBlockTimeDefaultService> = [];
    shares: [];
    startDate: string;
    taxIds: Array<string> = [];
    type: string;
    reviewDate: number;
    constructor() { }
    public addDefaultService(item) {
        this.services.push(new ContractsBlockTimeDefaultService(true, item.billable, item.commissionRate, item.versionedId.id, item.name, item.rate, item.taxes.map(tax => tax.id)))
    }
    public calculateTotalAmount() {
        let sum = 0;
        if (Number(this.includedHours) && Number(this.blockRate)) {
            sum = Number(this.includedHours) * Number(this.blockRate);
        } else {
            sum = 0;
        }
        return sum;
    };
    public setCompanyId(data) {
        this.companyId = data;
    }
    public getBlockTimeServicesName() {
        return this.blockTimeServices.map(item => item.name);
    }
    public checkDuplicatedBlockTimeServices() {
        this.blockTimeServices.forEach(item => {
            item.validateDuplicated = true;
        });
        this.blockTimeServices.forEach((item1, i) => {
            this.blockTimeServices.forEach((item2, u) => {
                if (i != u && item1.name === item2.name && item1.validateDuplicated && item2.validateDuplicated) item2.validateDuplicated = false;
            })
        })
        console.log("blockTimeServices", this.blockTimeServices);
        let validateDuplicated = (this.blockTimeServices.find(item => !item.validateDuplicated)) ? false : true;
        let validate = (this.blockTimeServices.find(item => !item.validate)) ? false : true;
        return validateDuplicated && validate;
    }
    public setStartDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            this.endDate = moment(finalDate.getTime() + 86400000000 * 30 * 12 * 100).format('YYYY/MM/DD');
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            this.endDate = moment(finalDate.getTime() + 86400000000 * 30 * 12 * 100).format('YYYY/MM/DD');
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