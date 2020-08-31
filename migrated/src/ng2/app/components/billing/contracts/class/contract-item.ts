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
}