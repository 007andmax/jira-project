import { ContractsHourlyService } from '../contracts-aside/class/contracts-hourly-service';
import * as moment from "moment";
import { ServiceAgreementBlockTimeServices } from './service-agreement-block-time-services';
import { СontractsBlockTimeShare } from '../contracts-aside/class/contracts-block-time-share';
import { ContractsBlockTimeDefaultService } from '../contracts-aside/class/contracts-block-time-default-service';
import { ContractsOtherProduct } from '../contracts-aside/class/contracts-other-product';
import { ServiceAgreementServiceExpenses } from './service-agreement-service-expenses';
export class ServiceAgreement {
    amount: number;
    billType: string;
    blockRate: string;
    blockTimeServices: Array<ServiceAgreementBlockTimeServices> = [];
    companyId: string;
    contractWithBlockTime: boolean;
    customInterval: number;
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
    productExpenses: Array<ContractsOtherProduct> = [];
    rateExceeding: string;
    reviewDate: string;
    serviceContractServices: Array<ServiceAgreementBlockTimeServices> = [];
    serviceContractServicesToTrack: Array<ServiceAgreementBlockTimeServices> = [];
    serviceExpenses: Array<ServiceAgreementServiceExpenses> = [];
    services: Array<ContractsBlockTimeDefaultService> = [];
    shares: Array<СontractsBlockTimeShare> = [];
    startDate: string;
    status: string;
    taxIds: Array<string> = [];
    type: string;
    manualCreateBillableItem: boolean;
    enableInvoiceAutoCreate: boolean;
    blockRate_str: string;
    rateExceeding_str: string;
    taxSum: number;
    taxes: Array<any> = [];
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.services = data.services.map(item => {
                return new ContractsBlockTimeDefaultService(item.basedOnDefault, item.billable, item.commissionRate, item.id, item.name, item.rate, item.taxIds, item.parentDefaultServiceId, false, item.discountAmount, item.discountType);
            })
            this.services.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
                1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
            this.blockTimeServices = data.blockTimeServices.map(item => new ServiceAgreementBlockTimeServices(item));
            this.serviceContractServicesToTrack = data.serviceContractServicesToTrack.map(item => new ServiceAgreementBlockTimeServices(item));
            this.serviceContractServices = data.serviceContractServices.map(item => new ServiceAgreementBlockTimeServices(item))
            this.maxRolloverHours = (data.maxRolloverHours) ? String(data.maxRolloverHours) : "";
            this.rateExceeding = (data.rateExceeding || data.rateExceeding == 0) ? String(data.rateExceeding) : "";
            this.blockRate = (typeof data.blockRate === "number") ? String(data.blockRate) : "";
            this.blockRate_str = parseFloat(this.blockRate).toFixed(2);
            this.rateExceeding_str = parseFloat(this.rateExceeding).toFixed(2);
            this.productExpenses = data.productExpenses.map(item => new ContractsOtherProduct(item.productId, item.quantity, item.salePrice, item.description));
            this.serviceExpenses = data.serviceExpenses.map(item => new ServiceAgreementServiceExpenses(item));
            this.shares = data.shares.map(item => new СontractsBlockTimeShare(item.userId));
        }
    }
    public setManualCreateBillableItem(data) {
        this.manualCreateBillableItem = data;
        if (this.manualCreateBillableItem) this.enableInvoiceAutoCreate = false;
    }
    public setEnableInvoiceAutoCreate(data) {
        if (this.manualCreateBillableItem) return;
        this.enableInvoiceAutoCreate = data;
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
        return validate && validateDescription;
    }
    public checkProductExpenses() {
        this.productExpenses.forEach(item => {
            item.validate = true;
        });
        this.productExpenses.forEach((item) => {
            if (item.productId.length === 0) item.validate = false;

        })

        let validate = (this.productExpenses.find(item => !item.validate)) ? false : true;
        return validate;
    }
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
        this.services.push(new ContractsBlockTimeDefaultService(true, item.billable, item.commissionRate, item.versionedId.id, item.name, item.rate, item.taxes.map(tax => tax.id), item.parentDefaultServiceId, true, item.discountAmount, item.discountType))
    }
    public getServiceContractServicesName() {
        return this.serviceContractServices.map(item => item.name);
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
        this.blockTimeServices.forEach(item => {
            item.validate = (item.name.length > 0);
        })
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
        this.services.forEach(item => {
            item.validate = (item.name.length > 0);
        })
        let validateDuplicated = (this.services.find(item => !item.validateDuplicated)) ? false : true;
        let validate = (this.services.find(item => !item.validate)) ? false : true;
        return validateDuplicated && validate;
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
        let validateDuplicated = (this.serviceContractServices.find(item => !item.validateDuplicated)) ? false : true;
        let validate = (this.serviceContractServices.find(item => !item.validate)) ? false : true;
        console.log("validateDuplicated", validateDuplicated);
        console.log("validate", validate);
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
            services: this.services.filter(item => item.selected).map(item => item.getDataForUpdate()),
            startDate: this.startDate,
            reviewDate: this.reviewDate,
            type: this.type
        }
    }
    public getDataForUpdateServiceContract(toggleMaximumAmountHours) {

        return {
            id: this.id,
            billType: this.billType,
            blockRate: (this.blockRate) ? this.blockRate : undefined,
            blockTimeServices: (toggleMaximumAmountHours) ? this.blockTimeServices.map(item => item.getDataForUpdateSubscriptionServices()) : null,
            companyId: this.companyId,
            contractWithBlockTime: toggleMaximumAmountHours,
            customInterval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? null : (this.intervalstring === '30 days') ? 30 : (this.intervalstring === '15 days') ? 15 : 7,
            description: this.description,
            endDate: this.endDate,
            invoiceAsSingleItem: this.invoiceAsSingleItem,
            includedHours: (this.includedHours) ? this.includedHours : null,
            interval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? this.intervalstring : null,
            rateExceeding: (this.rateExceeding && this.rateExceeding.length > 0) ? this.rateExceeding : null,
            serviceExpenses: null,
            productExpenses: null,
            serviceContractServices: this.serviceContractServices.map(item => item.getDataForUpdateContractServices()),
            serviceContractServicesToTrack: (!toggleMaximumAmountHours) ? this.blockTimeServices.map(item => item.getDataForUpdateSubscriptionServices()) : [],
            services: this.services.map(item => item.getDataForUpdate()),
            reviewDate: this.reviewDate,
            startDate: this.startDate,
            taxIds: (toggleMaximumAmountHours) ? this.taxIds : null,
            type: this.type,
            manualCreateBillableItem: this.manualCreateBillableItem,
            enableInvoiceAutoCreate: this.enableInvoiceAutoCreate
        }
    }
    public getDataForUpdateBlockTime() {
        return {
            blockRate: this.blockRate,
            blockTimeServices: this.blockTimeServices.map(item => item.getDataForUpdateSubscriptionServices()),
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
            services: this.services.map(item => item.getDataForUpdate()),
            shares: this.shares,
            startDate: this.startDate,
            taxIds: this.taxIds,
            reviewDate: this.reviewDate,
            type: "BLOCK_TIME",
            manualCreateBillableItem: this.manualCreateBillableItem,
            enableInvoiceAutoCreate: this.enableInvoiceAutoCreate
        }
    }

    public getDataForUpdateOtherContract() {
        return {
            billType: this.billType,
            companyId: this.companyId,
            customInterval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? null : (this.intervalstring === '30 days') ? 30 : (this.intervalstring === '15 days') ? 15 : 7,
            description: this.description,
            endDate: this.endDate,
            id: this.id,
            interval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? this.intervalstring : null,
            productExpenses: this.productExpenses.map(item => item.getDataForCrate()),
            serviceExpenses: this.serviceExpenses.map(item => item.getDataForUpdate()),
            reviewDate: this.reviewDate,
            startDate: this.startDate,
            type: this.type,
            manualCreateBillableItem: this.manualCreateBillableItem,
            enableInvoiceAutoCreate: this.enableInvoiceAutoCreate
        }
    }
    public calculateSubTotalAmountServiceContract() {
        let sum = 0;
        this.serviceContractServices.forEach(item => {
            sum += (item.count * item.rate);
        })
        return sum;
    };
    public calculateTotalAmountServiceContract() {
        let sum = 0;
        console.log("this.serviceContractServices", this.serviceContractServices);
        this.serviceContractServices.forEach(item => {
            let rate = item.taxes.map(item => item.rate).reduce((a, b) => a + b, 0);
            if (item.discountType == "PERCENT") sum += (item.count * item.rate * (1 - (Number(item.discountAmount) || 0) / 100) * (1 + rate / 100));
            if (item.discountType == "FIXED") sum += (((item.count * item.rate) - Number(item.discountAmount)) * (1 + rate / 100));
        })
        return sum;
    };
    public calculateTotalAmount() {
        let sum = 0;
        if (Number(this.includedHours) && Number(this.blockRate)) {
            sum = Number(this.includedHours) * Number(this.blockRate);
        } else {
            sum = 0;
        }
        return sum;
    };
    public calculateServiceDiscount() {
        let sum = 0;
        this.serviceContractServices.forEach(item => {
            if (item.discountType == "PERCENT") sum += (item.count * item.rate * (Number(item.discountAmount) || 0) / 100);
            if (item.discountType == "FIXED") sum += (Number(item.discountAmount) || 0);
        })
        return sum;
    }
    public calculateServiceTaxes() {
        let sum = 0;
        this.serviceContractServices.forEach(item => {
            sum += item.taxSum;
        })
        return sum;
    }
    public calculateServiceOthersTaxes() {
        let sum = 0;
        this.productExpenses.forEach(item => {
            sum += item.taxSum;
        })
        this.serviceExpenses.forEach(item => {
            sum += item.taxSum;
        })
        return sum;
    }
    public calculateTotalDiscount() {
        let sum = 0;
        this.serviceContractServices.forEach(item => {
            sum += item.discountSum;
        })
        return sum;
    };
}