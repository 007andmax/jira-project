export class CompanyDeviceCount {
    companyId: string;
    count: number;
    constructor(data) {
        this.companyId = data.companyId;
        this.count = data.count;
    }
}