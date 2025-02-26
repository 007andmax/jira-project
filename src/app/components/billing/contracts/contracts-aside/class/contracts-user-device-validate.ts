export class ContractsUserDeviceValidate {
    company: boolean = true;
    description: boolean = true;
    includedHours: boolean = true;
    rateExceeding: boolean = true;
    serviceContractServices: boolean = true;
    blockTimeServices: boolean = true;
    constructor() { }

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
    public resetServiceContractServices() {
        this.serviceContractServices = true;
    }
    public resetBlockTimeServices() {
        this.blockTimeServices = true;
    }
    public getServiceContractServices() {
        return this.serviceContractServices;
    }
    public getBlockTimeServices() {
        return this.blockTimeServices;
    }
    public getCompany() {
        return this.company;
    }
    public getDescription() {
        return this.description;
    }
    public getIncludedHours() {
        return this.includedHours;
    }

    public getRateExceeding() {
        return this.rateExceeding;
    }
    public isValidate(contractsBlockTime) {
        if (!contractsBlockTime.companyId) this.company = false;
        if (contractsBlockTime.description === "") this.description = false;
        if (contractsBlockTime.isCopy) {
            if (contractsBlockTime.contractWithBlockTime) {
                if (contractsBlockTime.includedHours === "" || contractsBlockTime.includedHours === "0") this.includedHours = false;
                if (Number(contractsBlockTime.rateExceeding) === 0) this.rateExceeding = false;
            }
        } else {
            if (contractsBlockTime.includedHours === "" || contractsBlockTime.includedHours === "0") this.includedHours = false;
            if (contractsBlockTime.rateExceeding !== "" && Number(contractsBlockTime.rateExceeding) === 0) this.rateExceeding = false;
        }
        if (contractsBlockTime.serviceContractServices.length == 0) this.serviceContractServices = false;
        if (contractsBlockTime.blockTimeServices.length == 0) this.blockTimeServices = false;
        return this.company && this.description && this.includedHours && this.rateExceeding && this.serviceContractServices && this.blockTimeServices;
    }
}