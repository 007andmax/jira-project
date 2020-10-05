export class ContractsUserDeviceValidate {
    company:boolean = true;
    description:boolean = true;
    includedHours:boolean = true;
    rateExceeding:boolean = true;
    constructor() {}

    public resetRateExceeding() {
        this.rateExceeding = true;
    }
    
    public resetIncludedHours() {
        this.includedHours = true;
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
    public getDescription () {
        return this.description;
    }
    public getIncludedHours () {
        return this.includedHours;
    }
    
    public getRateExceeding () {
        return this.rateExceeding;
    }
    public isValidate(contractsBlockTime) {
        if (!contractsBlockTime.companyId) this.company = false;
        if (contractsBlockTime.description === "") this.description = false;
        if (contractsBlockTime.contractWithBlockTime) {
            if (contractsBlockTime.includedHours === "") this.includedHours = false;
            if (contractsBlockTime.rateExceeding === "") this.rateExceeding = false;
        }
        return this.company && this.description && this.includedHours  && this.rateExceeding;
    }
}