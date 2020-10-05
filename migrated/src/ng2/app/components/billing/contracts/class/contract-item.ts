import { ContractItemCompany } from './contract-item-company';

export class ContractItem {
    amount: number;
    billType: string;
    company: ContractItemCompany;
    customInterval: any;
    description: string;
    endDate: number;
    id: string;
    includedHours: any;
    interval: string;
    reviewDate: number;
    startDate: number;
    status: string;
    type: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
    public getStartDateByMilliseconds() {
        return new Date(this.startDate).getTime();
    }
    public getReviewDateByMilliseconds() {
        return new Date(this.reviewDate).getTime();
    } 
    public getEndDateByMilliseconds() {
        return new Date(this.endDate).getTime();
    } 
}