export class ContractsUserDeviceValidate {
    company:boolean = true;
    description:boolean = true;
    includedHours:boolean = true;
    blockRate:boolean = true;
    rateExceeding:boolean = true;

    constructor() {}

    public resetRateExceeding() {
        this.rateExceeding = true;
    }
    public resetBlockRate() {
        this.blockRate  = true;
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
    public getBlockRate () {
        return this.blockRate;
    }
    public getRateExceeding () {
        return this.rateExceeding;
    }
    public isValidate(contractsBlockTime) {
        console.log("contractsBlockTime",contractsBlockTime);
        if (!contractsBlockTime.companyId) this.company = false;
        if (contractsBlockTime.description === "") this.description = false;
        if (contractsBlockTime.includedHours === "") this.includedHours = false;
        if (contractsBlockTime.blockRate === "") this.blockRate = false;
        if (contractsBlockTime.rateExceeding === "") this.rateExceeding = false;
       
        return this.company && this.description && this.includedHours && this.blockRate && this.rateExceeding;
    }
}