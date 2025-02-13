export class ContractsUserDeviceService {
    count: number;
    name: string;
    rate: number;
    taxIds: Array<string> = [];
    validate: boolean = true;
    validateDuplicated: boolean = true;
    rate_str: string;
    "subscriptionService": any;
    "discountAmount": string;
    "discountType": string = "PERCENT";
    discountSum: number = 0;
    descriptionValidate: string;
    taxSum: number = 0;
    taxes: Array<any> = [];
    constructor(count, name, rate, taxIds, serviceId, discountAmount = null, discountType = null, discountSum = null) {
        this.count = count;
        this.name = name;
        this.rate = rate;
        this.taxIds = taxIds;
        this.rate_str = this.rate.toFixed(2);
        this.subscriptionService = serviceId
        if (discountAmount) this.discountAmount = discountAmount;
        if (discountType) this.discountType = discountType;
        if (discountSum) this.discountSum = discountSum;
    }
    public getDataForCreate() {
        return {
            count: this.count,
            rate: String(this.rate),
            taxIds: this.taxIds,
            subscriptionService: this.subscriptionService,
            discountAmount: this.discountAmount ? this.discountAmount : undefined,
            discountType: this.discountAmount ? this.discountType : undefined
        }
    }
    public setValidate(data) {
        this.validate = data;
    }
    public setValidateDuplicated(data) {
        this.validateDuplicated = data;
    }
}