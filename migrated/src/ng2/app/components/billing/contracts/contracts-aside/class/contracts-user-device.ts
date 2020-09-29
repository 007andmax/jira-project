import { ContractsBlockTimeService } from './contracts-block-time-service';
import { ContractsUserDeviceService } from './contracts-user-device-service';
import * as moment from "moment";
import { ContractsBlockTimeDefaultService } from './contracts-block-time-default-service';
import { Tax } from 'src/ng2/class/taxes/tax';
import { ServiceAgreement } from '../../class/service-agreement';
import { ContractsOtherProduct } from './contracts-other-product';
import { ContractsOtherService } from './contracts-other-service';

export class ContractsUserDevice {
    billType: string = "DEVICE";
    blockRate: number;
    blockTimeServices: Array<ContractsBlockTimeService> = [new ContractsBlockTimeService("Managed Services Onsite", 0),
    new ContractsBlockTimeService("Managed Services Remote", 0)];
    companyId: string;
    contractWithBlockTime: boolean = false;
    customInterval: any;
    description: string = "";
    endDate: string;
    id: string;
    includedHours: string;
    interval: string;
    intervalstring: string = "MONTHLY";
    invoiceAsSingleItem: boolean = false;
    productExpenses: Array<ContractsOtherProduct> = [];
    rateExceeding: string;
    serviceContractServices: Array<ContractsUserDeviceService> = [];
    serviceContractServicesToTrack: Array<ContractsBlockTimeService> = [];
    serviceExpenses: Array<ContractsOtherService> = [];
    services: Array<ContractsBlockTimeDefaultService> = [];
    startDate: string;
    reviewDate: string;
    taxIds: Array<string>;
    type: string = "SERVICE_CONTRACT";
    constructor() {

    }

    public setDataFromCopy(data: ServiceAgreement) {
        this.billType = data.billType;
        this.blockRate = (data.blockRate.length > 0) ? Number(data.blockRate) : undefined;
        this.blockTimeServices = (data.blockTimeServices.length > 0) ? data.blockTimeServices.map(item => new ContractsBlockTimeService(item.name, item.rate)) : data.serviceContractServicesToTrack.map(item => new ContractsBlockTimeService(item.name, item.rate));
        this.companyId = data.companyId;
        this.contractWithBlockTime = (data.rateExceeding && data.includedHours) ? true  : false;
        this.customInterval = data.customInterval;
        this.description = data.description;
        this.endDate = data.endDate;
        this.invoiceAsSingleItem = data.invoiceAsSingleItem;
        this.includedHours = String(data.includedHours);
        if (data.interval) {
            this.intervalstring = data.interval;
        } else {
            this.intervalstring = (data.customInterval === 30) ? '30 days' : (data.customInterval === 15) ? '15 days' : '7 days';
        }
        this.rateExceeding = (data.rateExceeding) ? Number(data.rateExceeding).toFixed(2) : undefined;
        this.serviceContractServices = data.serviceContractServices.map(item => new ContractsUserDeviceService(item.count, item.name, item.rate, item.taxIds));
        this.services = data.services.map(item => new ContractsBlockTimeDefaultService(item.basedOnDefault, item.billable, (item.commissionRate) ? item.commissionRate : 0, item.id, item.name, item.rate, item.taxIds));
        this.startDate = data.startDate;
        this.taxIds = data.taxIds;

        this.reviewDate = data.reviewDate;
        this.calculateEndDate();
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
        this.serviceContractServices.forEach(item => {
            item.validate = (item.name.length > 0);
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
        this.blockTimeServices.forEach(item => {
            item.validate = (item.name.length > 0);
        })
        let validateDuplicated = (this.blockTimeServices.find(item => !item.validateDuplicated)) ? false : true;
        let validate = (this.blockTimeServices.find(item => !item.validate)) ? false : true;
        return validateDuplicated && validate;
    }

    public checkProductExpenses() {
        this.productExpenses.forEach(item => {
            item.validate = true;
        });
        this.productExpenses.forEach((item) => {
            if (item.description.length === 0 || item.productId.length === 0) item.validate = false;
          
        })
        
        let validate = (this.productExpenses.find(item => !item.validate)) ? false : true;
        return   validate;
    }
    public checkServiceExpenses() {
        this.serviceExpenses.forEach(item => {
            item.validate = true;
            item.validateDescription = true;
        });
        this.serviceExpenses.forEach((item) => {
            if (item.serviceId.length === 0) item.validate = false;
            if (item.description.length === 0) item.validateDescription = false;
          
        })
        
        let validate = (this.serviceExpenses.find(item => !item.validate)) ? false : true;
        let validateDescription = (this.serviceExpenses.find(item => !item.validateDescription)) ? false : true;
        return   validate && validateDescription;
    }
    public getDataForCreate(toggleMaximumAmountHours) {

        return {
            billType: this.billType,
            blockRate: this.blockRate,
            blockTimeServices: (toggleMaximumAmountHours) ? this.blockTimeServices.map(item => item.getDataForCreate()) : null,
            companyId: this.companyId,
            contractWithBlockTime: toggleMaximumAmountHours,
            customInterval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? null : (this.intervalstring === '30 days') ? 30 : (this.intervalstring === '15 days') ? 15 : 7,
            description: this.description,
            endDate: this.endDate,
            invoiceAsSingleItem: this.invoiceAsSingleItem,
            includedHours: this.includedHours,
            interval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? this.intervalstring : null,
            rateExceeding: this.rateExceeding,
            serviceContractServices: this.serviceContractServices.map(item => item.getDataForCreate()),
            serviceContractServicesToTrack: (!toggleMaximumAmountHours) ? this.blockTimeServices.map(item => item.getDataForCreate()) : [],
            services: this.services.map(item => item.getDataForCreate()),
            reviewDate: this.reviewDate,
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