export class ContractsBlockTimeService {
    name: string;
    rate: string;
    validate: boolean = true;
    validateDuplicated: boolean = true;
    descriptionValidate: string;
    constructor(name, rate) {
        this.name = name;
        this.rate = rate;
    }
    public setValidate(data) {
        this.validate = data;
    }
    public setValidateDuplicated(data) {
        this.validateDuplicated = data;
    }
    public getDataForCreate(rate) {
        return {
            name: this.name,
            rate: rate
        }
    }
}