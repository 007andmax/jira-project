import { ContractsHourlyService } from '../contracts-aside/class/contracts-hourly-service';
import * as moment from "moment";
import { ServiceAgreementBlockTimeServices } from './service-agreement-block-time-services';
import { СontractsBlockTimeShare } from '../contracts-aside/class/contracts-block-time-share';
import { v4 as uuidv4 } from 'uuid';
import { ContractsBlockTimeDefaultService } from '../contracts-aside/class/contracts-block-time-default-service';
export class ServiceAgreement {
    amount: number;
    billType: any;
    blockRate: number;
    blockTimeServices: Array<ServiceAgreementBlockTimeServices> = [];
    companyId: string;
    contractWithBlockTime: boolean;
    customBillingDate: any;
    customInterval: any;
    description: string;
    enableTimeRollover: boolean;
    endDate: string;
    glNumber: any;
    id: string;
    includedHours: number;
    interval: string;
    intervalstring: string;
    invoiceAsSingleItem: boolean;
    maxRolloverHours: any;
    productExpenses: any;
    rateExceeding: number;
    reviewDate: string;
    serviceContractServices: any;
    serviceContractServicesToTrack: any;
    serviceExpenses: any;
    services: Array<ContractsBlockTimeDefaultService> = [];
    shares: Array<СontractsBlockTimeShare> = [];
    startDate: string;
    status: string;
    taxIds: Array<string> = [];
    type: string;
    public setIntervalString(data) {
        this.intervalstring = data;
    }
    public setInterval(data) {
        this.interval = data;
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public getStartDateByMilliseconds() {
        return new Date(this.startDate).getTime();
    }
    public getReviewDateByMilliseconds() {
        return new Date(this.reviewDate).getTime();
    }
    public setTaxIds(data) {
        this.taxIds = data;
    }
    public setShares(data) {
        this.shares = data;
    }
    public addDefaultService(item) {
        this.services.push(new ContractsBlockTimeDefaultService(true, item.billable, item.commissionRate, item.versionedId.id, item.name, item.rate, item.taxes.map(tax => tax.id)))
    }
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.services = data.services.map(item => {
                return new ContractsBlockTimeDefaultService(item.basedOnDefault, item.billable, item.commissionRate, item.id, item.name, item.rate, item.taxIds);
            })
            this.services.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
                1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
            this.blockTimeServices = data.blockTimeServices.map(item => {
                return new ServiceAgreementBlockTimeServices(item);
            })
            this.maxRolloverHours = (data.maxRolloverHours) ? String(data.maxRolloverHours) : "";
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
    public getAllServicesName() {
        return [...this.getBlockTimeServicesName(), ...this.getServicesName()];
    }
    public getBlockTimeServicesName() {
        return this.blockTimeServices.map(item => item.name);
    }
    public getServicesName() {
        return this.services.map(item => item.name);
    }
    public getDataForUpdateHourly() {
        return {
            id: this.id,
            companyId: this.companyId,
            description: this.description,
            endDate: this.endDate,
            services: this.services.filter(item => item.selected).map(item => item.getDataForCreate()),
            startDate: this.startDate,
            reviewDate: this.reviewDate,
            type: this.type
        }
    }
    public getDataForUpdateBlockTime() {
        return {
            blockRate: this.blockRate,
            blockTimeServices: this.blockTimeServices.map(item => item.getDataForUpdate()),
            companyId: this.companyId,
            customInterval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? null : (this.intervalstring === '30 days') ? 30 : (this.intervalstring === '15 days') ? 15 : 7,
            description: this.description,
            enableTimeRollover: (this.maxRolloverHours && this.maxRolloverHours.length > 0) ? true : false,
            endDate: this.endDate,
            id: this.id,
            includedHours: this.includedHours,
            interval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? this.intervalstring : null,
            maxRolloverHours: this.maxRolloverHours,
            rateExceeding: this.rateExceeding,
            services: this.services.map(item => item.getDataForCreate()),
            shares: this.shares,
            startDate: this.startDate,
            taxIds: this.taxIds,
            reviewDate: this.reviewDate,
            type: "BLOCK_TIME"
        }
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
    public getDefaultBlockTimeService() {
        return {
            basedOnDefault: true,
            billable: true,
            commissionRate: 0,
            count: 0,
            id: uuidv4(),
            name: "",
            rate: 5,
            taxIds: []
        }
    }
}