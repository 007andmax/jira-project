export class ContractsUserDeviceService {
    count: number;
    name: string;
    rate: number;
    taxIds: Array<string> = [];
    validate: boolean = true;
    validateDuplicated: boolean = true;
    constructor(count, name, rate, taxIds) {
        this.count = count;
        this.name = name;
        this.rate = rate;
        this.taxIds = taxIds;
    }
    public getDataForCreate() {
        return {
            count: this.count,
            name: this.name,
            rate: this.rate,
            taxIds: this.taxIds,
        }
    }
    public setValidate(data) {
        this.validate = data;
    }
    public setValidateDuplicated(data) {
        this.validateDuplicated = data;
    }
}