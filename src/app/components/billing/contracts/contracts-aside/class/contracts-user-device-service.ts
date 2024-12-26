export class ContractsUserDeviceService {
    count: number;
    name: string;
    rate: number;
    taxIds: Array<string> = [];
    validate: boolean = true;
    validateDuplicated: boolean = true;
    rate_str: string;
    "subscriptionService": any;
    "discountAmount": string = "20";
    "discountType": string = "PERCENT";
    constructor(count, name, rate, taxIds, serviceId) {
        this.count = count;
        this.name = name;
        this.rate = rate;
        this.taxIds = taxIds;
        this.rate_str = this.rate.toFixed(2);
        this.subscriptionService = serviceId
    }
    public getDataForCreate() {
        return {
            count: this.count,
            name: this.name,
            rate: String(this.rate),
            taxIds: this.taxIds,
            subscriptionService: this.subscriptionService,
            discountAmount: this.discountAmount,
            discountType: this.discountType
        }
    }
    public setValidate(data) {
        this.validate = data;
    }
    public setValidateDuplicated(data) {
        this.validateDuplicated = data;
    }
}