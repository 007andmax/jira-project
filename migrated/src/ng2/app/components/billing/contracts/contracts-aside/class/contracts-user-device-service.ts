export class ContractsUserDeviceService {
    count: number;
    name: string;
    rate: number;
    taxIds: Array<string> = [];
    constructor(count,name,rate,taxIds) {
        this.count = count;
        this.name = name;
        this.rate = rate;
        this.taxIds = taxIds;
    }
}