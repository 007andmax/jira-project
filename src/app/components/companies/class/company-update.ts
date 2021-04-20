import { Company } from 'src/app/interfaces/company/company';

export class CompanyUpdate {
    action: string;
    list: Array<Company> = [];
    data: Company;
    constructor(action, data, list) {
        this.action = action;
        this.list = list;
        this.data = data;
    }
}