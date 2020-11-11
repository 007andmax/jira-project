export class ContractsBlockTimeService {
    name: string;
    rate: string;
    validate: boolean = true;
    validateDuplicated: boolean = true;
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
    public getDataForCreate() {
        return {
            name: this.name,
            rate: this.rate
        }
    }
}