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
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.rate_str = this.rate.toFixed(2);
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
    public setValidate(data) {
        this.validate = data;
    }
    public setValidateDuplicated(data) {
        this.validateDuplicated = data;
    }
}