import { ContractsBlockTimeService } from './contracts-block-time-service';
import * as moment from "moment";
import { ContractsBlockTimeDefaultService } from './contracts-block-time-default-service';
import { СontractsBlockTimeShare } from './contracts-block-time-share';
import { ServiceAgreement } from '../../class/service-agreement';
export class ContractsBlockTime {
    billType: any;
    blockRate: string = "";
    blockTimeServices: Array<ContractsBlockTimeService> = [];
    companyId: string;
    customInterval: number;
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
    type: string = "BLOCK_TIME";
    reviewDate: string;
    manualCreateBillableItem: boolean = false;
    enableInvoiceAutoCreate: boolean = false;
    taxSum: number = 0;
    taxes: Array<any> = [];
    isPerpetual: boolean = false;
    constructor() { }
    public setDataFromCopy(data: ServiceAgreement) {
        this.billType = data.billType;
        this.blockRate = Number(data.blockRate).toFixed(2);
        this.blockTimeServices = data.blockTimeServices.map(item => new ContractsBlockTimeService(item.name, item.rate, item.parentDefaultServiceId));
        this.companyId = data.companyId;
        this.customInterval = data.customInterval;
        this.description = data.description;
        this.enableTimeRollover = data.enableTimeRollover;
        this.endDate = data.endDate;
        this.includedHours = String(data.includedHours);
        this.maxRolloverHours = (data.maxRolloverHours) ? String(data.maxRolloverHours) : null;
        if (data.interval) {
            this.intervalstring = data.interval;
        } else {
            this.intervalstring = (data.customInterval === 30) ? '30 days' : (data.customInterval === 15) ? '15 days' : '7 days';
        }
        this.rateExceeding = Number(data.rateExceeding).toFixed(2);
        this.services = data.services.map(item => new ContractsBlockTimeDefaultService(item.basedOnDefault, item.billable, (item.commissionRate) ? item.commissionRate : 0, item.id, item.name, item.rate, item.taxIds, item.parentDefaultServiceId, false, item.discountAmount, item.discountType));
        this.shares = data.shares.map(item => new СontractsBlockTimeShare(item.userId));
        this.startDate = data.startDate;
        this.taxIds = data.taxIds;
        if (data.manualCreateBillableItem != undefined) this.manualCreateBillableItem = data.manualCreateBillableItem;
        if (data.enableInvoiceAutoCreate != undefined) this.enableInvoiceAutoCreate = data.enableInvoiceAutoCreate;
        this.reviewDate = data.reviewDate;
        this.isPerpetual = data.isPerpetual;
        this.calculateEndDate();
    }
    public setManualCreateBillableItem(data) {
        this.manualCreateBillableItem = data;
        if (this.manualCreateBillableItem) this.enableInvoiceAutoCreate = false;
    }
    public setEnableInvoiceAutoCreate(data) {
        if (this.manualCreateBillableItem) return;
        this.enableInvoiceAutoCreate = data;
    }
    public setShares(data) {
        this.shares = data;
    }
    public addDefaultService(item) {
        this.services.push(new ContractsBlockTimeDefaultService(true, item.billable, item.commissionRate, item.versionedId.id, item.name, item.rate, item.taxes.map(tax => tax.id), item.parentDefaultServiceId, false, item.discountAmount, item.discountType))
    }
    public setTaxIds(data) {
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
        let data: any = {
            blockRate: Number(this.blockRate),
            blockTimeServices: this.blockTimeServices.map(item => item.getDataForCreate(this.rateExceeding)),
            companyId: this.companyId,
            customInterval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? null : (this.intervalstring === '30 days') ? 30 : (this.intervalstring === '15 days') ? 15 : 7,
            description: this.description,
            enableTimeRollover: (this.maxRolloverHours && this.maxRolloverHours.length > 0) ? true : false,
            maxRolloverHours: this.maxRolloverHours,
            includedHours: this.includedHours,
            interval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? this.intervalstring : null,
            rateExceeding: Number(this.rateExceeding),
            services: this.services.map(item => item.getDataForCreate()),
            shares: this.shares,
            startDate: this.startDate,
            reviewDate: this.reviewDate,
            taxIds: this.taxIds,
            type: this.type,
            manualCreateBillableItem: this.manualCreateBillableItem,
            enableInvoiceAutoCreate: this.enableInvoiceAutoCreate,
            isPerpetual: this.isPerpetual
        };
        if (!this.isPerpetual) data.endDate = this.endDate;
        return data
    }
    public setCompanyId(data) {
        this.companyId = data;
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
    public checkDuplicatedBlockTimeServices() {
        this.blockTimeServices.forEach(item => {
            item.validateDuplicated = true;
        });
        this.blockTimeServices.forEach((item1, i) => {
            this.blockTimeServices.forEach((item2, u) => {
                if (i != u && item1.name === item2.name && item1.validateDuplicated && item2.validateDuplicated) item2.validateDuplicated = false;
            })
        })
        this.blockTimeServices.forEach(item => {
            item.validate = (item.name.length > 0);
        })
        let validateDuplicated = (this.blockTimeServices.find(item => !item.validateDuplicated)) ? false : true;
        let validate = (this.blockTimeServices.find(item => !item.validate)) ? false : true;
        return validateDuplicated && validate;
    }
    public checkDuplicatedBlockTimeAndTrackServices() {
        this.blockTimeServices.forEach(item => {
            item.validateDuplicated = true;
        });
        let list = [...this.blockTimeServices, ...this.services];
        list.forEach((item1, i) => {
            list.forEach((item2, u) => {
                if (i != u && item1.name === item2.name && item1.validateDuplicated && item2.validateDuplicated) item2.validateDuplicated = false;
            })
        })
        let validateDuplicated = (list.find(item => !item.validateDuplicated)) ? false : true;
        let validate = (list.find(item => !item.validate)) ? false : true;
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
        this.services.forEach(item => {
            item.validate = (item.name.length > 0);
        })
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
            this.calculateEndDate();
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.startDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
            this.calculateEndDate();
        }

    }
    public calculateEndDate() {
        if (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') {
            let endDate = new Date(this.startDate);
            endDate.setFullYear(endDate.getFullYear() + 1);
            endDate.setDate(endDate.getDate() - 1);
            this.endDate = moment(endDate).format('YYYY/MM/DD');

        } else if (this.intervalstring === '30 days') {
            let endDate = new Date(this.startDate);
            endDate.setTime(endDate.getTime() + 60000 * 60 * 24 * 29);
            this.endDate = moment(endDate).format('YYYY/MM/DD');

        } else if (this.intervalstring === '15 days') {
            let endDate = new Date(this.startDate);
            endDate.setTime(endDate.getTime() + 60000 * 60 * 24 * 14);
            this.endDate = moment(endDate).format('YYYY/MM/DD');

        } else if (this.intervalstring === '7 days') {
            let endDate = new Date(this.startDate);
            endDate.setTime(endDate.getTime() + 60000 * 60 * 24 * 7);
            this.endDate = moment(endDate).format('YYYY/MM/DD');

        }
    }
    public setReviewDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1) || year !== current.getFullYear()) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.reviewDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.reviewDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
        }
    }
    public setEndDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1) || year !== current.getFullYear()) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.endDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.endDate = moment(finalDate.getTime()).format('YYYY/MM/DD');
        }
    }
    public getEndDateByMilliseconds() {
        return new Date(this.endDate).getTime();
    }
    public getStartDateByMilliseconds() {
        return new Date(this.startDate).getTime();
    }
}