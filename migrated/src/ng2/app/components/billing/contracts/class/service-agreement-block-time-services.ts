export class ServiceAgreementBlockTimeServices {
    basedOnDefault: boolean;
    billable: boolean;
    commissionRate: number;
    count: number;
    id: string;
    name: string;
    rate: number;
    taxIds: Array<string>;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}