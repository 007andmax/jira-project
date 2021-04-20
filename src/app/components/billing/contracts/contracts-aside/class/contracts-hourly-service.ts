export class ContractsHourlyService {
    selected: boolean = true;
    basedOnDefault: boolean;
    billable: boolean;
    commissionRate: number;
    id: string;
    name: string;
    rate: number;
    taxIds: Array<String> = [];
    constructor(basedOnDefault, billable, commissionRate, id, name, rate, taxIds) {
        this.basedOnDefault = basedOnDefault;
        this.billable = billable;
        this.commissionRate = commissionRate;
        this.id = id;
        this.name = name;
        this.rate = rate;
        this.taxIds = taxIds;

    }
    public getDataForCreate() {
        return {
            basedOnDefault: this.basedOnDefault,
            billable: this.billable,
            commissionRate: this.commissionRate,
            id: this.id,
            name: this.name,
            rate: this.rate,
            taxIds: this.taxIds
        }
    }
}