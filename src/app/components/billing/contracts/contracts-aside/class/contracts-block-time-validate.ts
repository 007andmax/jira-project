export class ContractsBlockTimeValidate {
    company: boolean = true;
    description: boolean = true;
    includedHours: boolean = true;
    blockRate: boolean = true;
    rateExceeding: boolean = true;
    blockTimeServices: boolean = true;
    constructor() { }

    public resetRateExceeding() {
        this.rateExceeding = true;
    }
    public resetBlockRate() {
        this.blockRate = true;
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
    public resetBlockTimeServices() {
        this.blockTimeServices = true;
    }
    public getCompany() {
        return this.company;
    }
    public getBlockTimeServices() {
        return this.blockTimeServices;
    }
    public getDescription() {
        return this.description;
    }
    public getIncludedHours() {
        return this.includedHours;
    }
    public getBlockRate() {
        return this.blockRate;
    }
    public getRateExceeding() {
        return this.rateExceeding;
    }
    public isValidate(contractsBlockTime) {
        console.log("contractsBlockTime.services", contractsBlockTime.services);
        if (!contractsBlockTime.companyId) this.company = false;
        if (contractsBlockTime.description === "") this.description = false;
        if (contractsBlockTime.includedHours === "") this.includedHours = false;
        if (contractsBlockTime.blockRate === "") this.blockRate = false;
        if (contractsBlockTime.rateExceeding === "") this.rateExceeding = false;
        if (contractsBlockTime.blockTimeServices.length == 0) this.blockTimeServices = false;
        return this.company && this.description && this.includedHours && this.blockRate && this.rateExceeding && this.blockTimeServices && contractsBlockTime.services.every(item => item.validateDuplicated == true);
    }
}