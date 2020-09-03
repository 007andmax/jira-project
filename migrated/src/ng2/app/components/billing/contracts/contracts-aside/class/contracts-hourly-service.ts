export class ContractsHourlyService {
    basedOnDefault: boolean;
    billable: boolean;
    commissionRate: number;
    id: string;
    name: string;
    rate: number;
    taxIds: Array<String> = [];
    constructor() { }
}