import { ContractsHourly } from './contracts-hourly';

export class ContractsHourlyValidate {
    description: boolean = true;
    company: boolean = true;
    date: boolean = true;
    constructor() {

    }
    public resetCompany() {
        this.company = true;
    }
    public resetDate() {
        this.date = true;
    }
    public getCompany() {
        return this.company;
    }
    public getDate() {
        return this.date;
    }
    public setDate(data) {
        this.date = data;
    }
    public getDescription() {
        return this.description;
    }
    public resetDescription() {
        this.description = true;
    }
    public isValidate(contractsHourly) {
        if (contractsHourly.description === "") this.description = false;
        if (!contractsHourly.companyId) this.company = false;
        return this.description && this.company;
    }
    public isValidateRateServices(services) {
        services.forEach(item => {
            if (item.billable && item.rate == 0) item.validateRate = false;
        })
        return services.every(item => item.validateRate);
    }
}