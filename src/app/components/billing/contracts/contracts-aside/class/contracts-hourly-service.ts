export class ContractsHourlyService {
    selected: boolean = true;
    basedOnDefault: boolean;
    billable: boolean;
    commissionRate: number;
    id: string;
    name: string;
    rate: number;
    taxIds: Array<String> = [];
    rate_str: string;
    isAdded: boolean = false;
    parentDefaultServiceId: string;
    constructor(basedOnDefault, billable, commissionRate, id, name, rate, taxIds, parentDefaultServiceId, isAdded = false) {
        this.basedOnDefault = basedOnDefault;
        this.billable = billable;
        this.commissionRate = commissionRate;
        this.id = id;
        this.name = name;
        this.rate = rate;
        this.taxIds = taxIds;
        this.rate_str = this.rate.toFixed(2);
        this.isAdded = isAdded;
        this.parentDefaultServiceId = parentDefaultServiceId;
    }
    public getDataForCreate() {
        return {
            parentDefaultServiceId: this.id,
            basedOnDefault: this.basedOnDefault,
            billable: this.billable,
            commissionRate: this.commissionRate,
            rate: this.rate,
            taxIds: this.taxIds
        }
    }
    public getDataForUpdate() {
        let data: any = {
            basedOnDefault: this.basedOnDefault,
            billable: this.billable,
            commissionRate: this.commissionRate,
            rate: this.rate,
            taxIds: this.taxIds
        }
        console.log("this.isAdded", this.isAdded);
        if (this.isAdded) data.parentDefaultServiceId = this.id;
        if (!this.isAdded) {
            data.id = this.id;
            data.parentDefaultServiceId = this.parentDefaultServiceId;
        }
        return data
    }
}