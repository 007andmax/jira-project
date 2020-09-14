import { ContractsBlockTimeService } from './contracts-block-time-service';
import * as moment from "moment";
import { ContractsBlockTimeDefaultService } from './contracts-block-time-default-service';
import { СontractsBlockTimeShare } from './contracts-block-time-share';
export class ContractsBlockTime {
    billType: any;
    blockRate: string = "";
    blockTimeServices: Array<ContractsBlockTimeService> = [new ContractsBlockTimeService("On site block time service", 5),
    new ContractsBlockTimeService("Remote block time service", 5)];
    companyId: string;
    customInterval: any;
    description: string = "";
    enableTimeRollover: boolean;
    endDate: string;
    id: string;
    includedHours: string = "";
    maxRolloverHours: string = "";
    intervalstring: string = "MONTHLY";
    rateExceeding: string = "";
    services: Array<ContractsBlockTimeDefaultService> = [];
    shares: Array<СontractsBlockTimeShare> = [];
    startDate: string;
    taxIds: Array<string> = [];
    type: string;
    reviewDate: string;
    constructor() { }
    public setShares(data) {
        this.shares = data;
    }
    public addDefaultService(item) {
        this.services.push(new ContractsBlockTimeDefaultService(true, item.billable, item.commissionRate, item.versionedId.id, item.name, item.rate, item.taxes.map(tax => tax.id)))
    }
    public setTaxIds (data) {
        this.taxIds = data;
    }
    public setInterval(data) {
        this.intervalstring = data;
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
    public getDataForCreate() {
        return {
            blockRate: Number(this.blockRate),
            blockTimeServices: this.blockTimeServices.map(item => item.getDataForCreate()),
            companyId: this.companyId,
            customInterval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? null : (this.intervalstring === '30 days') ? 30 : (this.intervalstring === '15 days') ? 15 : 7,
            description: this.description,
            enableTimeRollover: (this.maxRolloverHours.length > 0) ? true : false,
            endDate: this.endDate,
            maxRolloverHours: this.maxRolloverHours,
            includedHours: this.includedHours,
            interval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? this.intervalstring  : null,
            rateExceeding: Number(this.rateExceeding),
            services: this.services.map(item => item.getDataForCreate()),
            shares: this.shares,
            startDate: this.startDate,
            reviewDate: this.reviewDate,
            taxIds: this.taxIds,
            type: "BLOCK_TIME"
        }
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public getAllServicesName() {
        return [...this.getBlockTimeServicesName(),...this.getServicesName()];
    }
    public getBlockTimeServicesName() {
        return this.blockTimeServices.map(item => item.name);
    }
    public getServicesName() {
        return this.services.map(item => item.name);
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
    public checkDuplicatedServices() {
        this.services.forEach(item => {
            item.validateDuplicated = true;
        });
        this.services.forEach((item1, i) => {
            this.services.forEach((item2, u) => {
                if (i != u && item1.name === item2.name && item1.validateDuplicated && item2.validateDuplicated) item2.validateDuplicated = false;
            })
        })
        console.log("services", this.services);
        let validateDuplicated = (this.services.find(item => !item.validateDuplicated)) ? false : true;
        let validate = (this.services.find(item => !item.validate)) ? false : true;
        return validateDuplicated && validate;
    }
    public setStartDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            let endDate = new Date(finalDate.getTime());
            endDate.setFullYear(endDate.getFullYear() + 50);
            endDate.setDate(endDate.getDate() - 1);
            this.endDate = moment(endDate).format('YYYY/MM/DD');
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            let endDate = new Date(finalDate.getTime());
            endDate.setFullYear(endDate.getFullYear() + 50);
            endDate.setDate(endDate.getDate() - 1);
            this.endDate = moment(endDate).format('YYYY/MM/DD');
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
}