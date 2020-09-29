import { ContractsUserDevice } from './contracts-user-device';

export class ContractsOther extends ContractsUserDevice {
    billType: "OTHER";


    public getTotalAmountOther() {
        let totalAmount = 0;
        if (this.productExpenses.length > 0) {
            for (var i = 0; i < this.productExpenses.length; i++) {
                var productCost = this.productExpenses[i].quantity * this.productExpenses[i].salePrice;
                totalAmount = totalAmount + productCost;
            }
        }
        return totalAmount;
    }
    public getDataForCreateOther() {
        return {
            billType: "OTHER",
            blockTimeServices: null,
            companyId: this.companyId,
            contractWithBlockTime: false,
            customInterval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? null : (this.intervalstring === '30 days') ? 30 : (this.intervalstring === '15 days') ? 15 : 7,
            description: this.description,
            endDate: this.endDate,
            id: null,
            includedHours: null,
            interval: (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') ? this.intervalstring : null,
            productExpenses: this.productExpenses.map(item => item.getDataForCrate()),
            rateExceeding: null,
            serviceContractServices: [],
            serviceContractServicesToTrack: [],
            serviceExpenses: this.serviceExpenses.map(item => item.getDataForCrate()),
            services: [],
            startDate: this.startDate,
            taxIds: null,
            type: "SERVICE_CONTRACT"
        }
    }
}