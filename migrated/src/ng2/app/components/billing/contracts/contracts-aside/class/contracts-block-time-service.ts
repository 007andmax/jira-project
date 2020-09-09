export class ContractsBlockTimeService {
    name: string;
    rate: string;
    validate:boolean = true;
    constructor(name, rate) {
        this.name = name;
        this.rate = rate;
    }
    public setValidate(data) {
        this.validate = data;
    }
}