export class ServiceAgreementBlockTimeServices {
    basedOnDefault: boolean;
    billable: boolean;
    commissionRate: number;
    count: number;
    id: string;
    name: string;
    rate: number;
    taxIds: Array<string>;
    validate: boolean = true;
    validateDuplicated: boolean = true;
    rate_str: string;
    subscriptionService: any;
    parentDefaultServiceId: any;
    discountAmount: number;
    discountSum: number;
    discountType: string;
    isAdded: boolean = false;
    descriptionValidate: string;
    constructor(data = null, isAdded = false) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.rate_str = this.rate.toFixed(2);
            this.isAdded = isAdded;
            if (!data.discountType) this.discountType = "PERCENT";
        }
    }
    public setTaxIds(data) {
        this.taxIds = data;
    }
    public getDataForUpdate() {
        return {
            basedOnDefault: this.basedOnDefault,
            billable: this.billable,
            commissionRate: this.commissionRate,
            count: this.count,
            id: this.id,
            name: this.name,
            rate: this.rate,
            taxIds: this.taxIds,
        }
    }
    public getDataForUpdateSubscriptionServices() {
        let data: any = {
            "basedOnDefault": this.basedOnDefault,
            "rate": this.rate,
            billable: this.billable,
            taxIds: this.taxIds,
        }
        console.log("this.isAdded", this.isAdded);
        if (this.isAdded) data.parentDefaultServiceId = this.id;
        if (!this.isAdded) {
            data.id = this.id;
            data.parentDefaultServiceId = this.parentDefaultServiceId;
        }
        if (this.count) data.count = this.count;
        if (this.commissionRate) data.commissionRate = this.commissionRate;
        return data
    }
    public getDataForUpdateContractServices() {
        let data: any = {
            "count": this.count,
            "rate": this.rate,
            "taxIds": this.taxIds,
            "subscriptionService": {
                "id": this.subscriptionService.id
            },
            "discountAmount": this.discountAmount ? this.discountAmount : undefined,
            "discountType": this.discountAmount ? this.discountType : undefined
        };
        if (!this.isAdded) data.id = this.id;
        return data
    }
    public setValidate(data) {
        this.validate = data;
    }
    public setValidateDuplicated(data) {
        this.validateDuplicated = data;
    }
}