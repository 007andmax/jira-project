import { ServiceAgreement } from '../../class/service-agreement';
import { ContractsOtherService } from './contracts-other-service';
import { ContractsUserDevice } from './contracts-user-device';

export class ContractsOther extends ContractsUserDevice {
    billType: string = "OTHER";
    public setDataFromCopy(data: ServiceAgreement) {
        this.billType = data.billType;
        this.companyId = data.companyId;
        this.customInterval = data.customInterval;
        this.description = data.description;
        this.endDate = data.endDate;
        this.includedHours = String(data.includedHours);
        if (data.interval) {
            this.intervalstring = data.interval;
        } else {
            this.intervalstring = (data.customInterval === 30) ? '30 days' : (data.customInterval === 15) ? '15 days' : '7 days';
        }
        this.productExpenses = data.productExpenses;
        this.serviceExpenses = data.serviceExpenses.map(item => new ContractsOtherService(item.date, item.description, item.quantity, item.serviceId, item.name));
        this.startDate = data.startDate;
        this.reviewDate = data.reviewDate;
        this.calculateEndDate();
    }
    public getTotalAmountOther() {
        let totalAmount = 0;
        if (this.productExpenses.length > 0) {
            for (var i = 0; i < this.productExpenses.length; i++) {
                var productCost = this.productExpenses[i].quantity * this.productExpenses[i].salePrice;
                totalAmount = totalAmount + productCost;
            }
        }
        if (this.serviceExpenses.length > 0) {
            for (var i = 0; i < this.serviceExpenses.length; i++) {
                var serviceCost = this.serviceExpenses[i].quantity * this.serviceExpenses[i].rate;
                totalAmount = totalAmount + serviceCost;
            }
        }
        return totalAmount;
    }
    public getDataForCreateOther() {

        return {
            billType: "OTHER",
            companyId: this.companyId,
            customInterval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? null : (this.intervalstring === '30 days') ? 30 : (this.intervalstring === '15 days') ? 15 : 7,
            description: this.description,
            endDate: this.endDate,
            interval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? this.intervalstring : null,
            productExpenses: this.productExpenses.map(item => item.getDataForCrate()),
            serviceExpenses: this.serviceExpenses.map(item => item.getDataForCrate()),
            startDate: this.startDate,
            reviewDate: this.reviewDate,
            customBillingDate: this.customBillingDate,
            type: "SERVICE_CONTRACT"
        }
    }
}