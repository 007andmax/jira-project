import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';

import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { WorkDay } from './work-day';
import { CompanyService } from './company-service';

export class CompanyProfile {
    accountNumber: any;
    addresses: Array<CompanyAndress>;
    agentLinkToEmail: any;
    clientIndustry: any;
    clientType: string = '';
    contacts: Array<CompanyAndressContact>;
    defaultPaymentMethod: any;
    domain: string;
    login: string;
    maxAgents: number;
    name: string;
    password: string;
    removeOfflineTime: number;
    services: Array<CompanyService>;
    workingDays: Array<WorkDay>;
    constructor() { 
        let contact:CompanyAndressContact = {firstName: "уауауау"
        lastName: "уауауау",primaryEmail:"",}
        this.contacts = [new CompanyAndressContact()]
    }

}