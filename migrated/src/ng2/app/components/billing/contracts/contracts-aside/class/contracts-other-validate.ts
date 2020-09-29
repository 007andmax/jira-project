import { ContractsBlockTimeValidate } from './contracts-block-time-validate';
import { ContractsOther } from './contracts-other';

export class ContractsOtherValidate {

    company: boolean = true;
    description: boolean = true;
    servicesOrProducts: boolean = true;


    constructor() { }

    public getServicesOrProducts() {
        return this.servicesOrProducts;
    }
    public resetServicesOrProducts() {
        this.servicesOrProducts = true;
    }

    public resetCompany() {
        this.company = true;
    }
    public resetDescription() {
        this.description = true;
    }
    public getCompany() {
        return this.company;
    }
    public getDescription() {
        return this.description;
    }

    public isValidate(contractsOther:ContractsOther) {
        console.log("contractsOther", contractsOther);
        if (!contractsOther.companyId) this.company = false;
        if (contractsOther.description === "") this.description = false;
        if (contractsOther.productExpenses.length  === 0 && contractsOther.serviceExpenses.length  === 0) this.servicesOrProducts = false;
        

        return this.company && this.description && this.servicesOrProducts;
    }

}