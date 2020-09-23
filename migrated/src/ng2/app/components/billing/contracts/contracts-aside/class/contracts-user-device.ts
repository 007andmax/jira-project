import { ContractsBlockTimeService } from './contracts-block-time-service';
import { ContractsUserDeviceService } from './contracts-user-device-service';
import * as moment from "moment";
import { ContractsBlockTimeDefaultService } from './contracts-block-time-default-service';
import { Tax } from 'src/ng2/class/taxes/tax';

export class ContractsUserDevice {
    billType: string = "DEVICE";
    blockRate: number;
    blockTimeServices: Array<ContractsBlockTimeService> = [new ContractsBlockTimeService("Managed Services Onsite", 0),
    new ContractsBlockTimeService("Managed Services Remote", 0)];
    companyId: string;
    contractWithBlockTime: boolean = false;
    customInterval: any;
    description: string;
    endDate: string;
    id: string;
    includedHours: string = null;
    interval: string;
    intervalstring: string = "MONTHLY";
    invoiceAsSingleItem: boolean = false;
    productExpenses: any;
    rateExceeding: string = null;
    serviceContractServices: Array<ContractsUserDeviceService> = [];
    serviceContractServicesToTrack: Array<ContractsBlockTimeService> = [];
    serviceExpenses: any;
    services: Array<ContractsBlockTimeDefaultService> = [];
    startDate: string;
    reviewDate: string;
    taxIds: Array<Tax>;
    type: string = "SERVICE_CONTRACT";
    constructor() {

    }
    public calculateTotalAmount() {
        let sum = 0;
        this.serviceContractServices.forEach(item => {
            sum += (item.count * item.rate);
        })
        return sum;
    }
    public addDefaultService(item) {
        this.services.push(new ContractsBlockTimeDefaultService(true, item.billable, item.commissionRate, item.versionedId.id, item.name, item.rate, item.taxes.map(tax => tax.id)))
    }
    public setTaxIds(data) {
        this.taxIds = data;
    }
    public getServiceContractServicesName() {
        return this.serviceContractServices.map(item => item.name);
    }
    public getBlockTimeServicesName() {
        return this.blockTimeServices.map(item => item.name);
    }
    public getServicesName() {
        return this.services.map(item => item.name);
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
    public checkDuplicatedServiceContractServices() {
        this.serviceContractServices.forEach(item => {
            item.validateDuplicated = true;
        });
        this.serviceContractServices.forEach((item1, i) => {
            this.serviceContractServices.forEach((item2, u) => {
                if (i != u && item1.name === item2.name && item1.validateDuplicated && item2.validateDuplicated) item2.validateDuplicated = false;
            })
        })
        console.log("serviceContractServices", this.serviceContractServices);
        let validateDuplicated = (this.serviceContractServices.find(item => !item.validateDuplicated)) ? false : true;
        let validate = (this.serviceContractServices.find(item => !item.validate)) ? false : true;
        return validateDuplicated && validate;
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
    public getDataForCreate() {

        return {
            billType: this.billType,
            blockRate: this.blockRate,
            blockTimeServices: (this.contractWithBlockTime) ? this.blockTimeServices.map(item => item.getDataForCreate()) : null,
            companyId: this.companyId,
            contractWithBlockTime: this.contractWithBlockTime,
            customInterval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? null : (this.intervalstring === '30 days') ? 30 : (this.intervalstring === '15 days') ? 15 : 7,
            description: this.description,
            endDate: this.endDate,
            includedHours: this.includedHours,
            interval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? this.intervalstring : null,
            rateExceeding: this.rateExceeding,
            serviceContractServices: this.serviceContractServices.map(item => item.getDataForCreate()),
            serviceContractServicesToTrack: (!this.contractWithBlockTime) ? this.blockTimeServices.map(item => item.getDataForCreate()) : [],
            services: this.services.map(item => item.getDataForCreate()),
            
            startDate: this.startDate,
            taxIds: this.taxIds,
            type: "SERVICE_CONTRACT"
        }
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
        return [...this.getBlockTimeServicesName(), ...this.getServicesName(), ...this.getServiceContractServicesName()];
    }
}