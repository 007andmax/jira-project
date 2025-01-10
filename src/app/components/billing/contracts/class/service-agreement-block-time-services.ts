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
    constructor(data = null, isAdded = false) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.rate_str = this.rate.toFixed(2);
            this.isAdded = isAdded;
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
            data.parentDefaultServiceId = this.id;
        }
        if (this.count) data.count = this.count;
        if (this.commissionRate) data.commissionRate = this.commissionRate;
        return data
    }
    public getDataForUpdateContractServices() {
        return {
            "count": this.count,
            "rate": this.rate,
            "taxIds": this.taxIds,
            "subscriptionService": {
                "id": this.id
            },
            "discountAmount": this.discountAmount,
            "discountType": this.discountType
        }
    }
    public setValidate(data) {
        this.validate = data;
    }
    public setValidateDuplicated(data) {
        this.validateDuplicated = data;
    }
}