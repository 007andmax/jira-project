import { count } from "console";

export class ContractsBlockTimeService {
    name: string;
    rate: string;
    validate: boolean = true;
    validateDuplicated: boolean = true;
    descriptionValidate: string;
    "parentDefaultServiceId": string;
    "basedOnDefault": boolean = true;
    constructor(name, rate, parentDefaultServiceId) {
        this.name = name;
        this.rate = rate;
        this.parentDefaultServiceId = parentDefaultServiceId;
    }
    public setValidate(data) {
        this.validate = data;
    }
    public setValidateDuplicated(data) {
        this.validateDuplicated = data;
    }
    public getDataForCreate(rate) {
        return {
            "parentDefaultServiceId": this.parentDefaultServiceId,
            "basedOnDefault": this.basedOnDefault,
            rate: rate,

        }
    }
}