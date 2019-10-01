import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';

import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { WorkDay } from './work-day';

export class CompanyProfile {
    accountNumber: any;
    addresses: Array<CompanyAndress>;
    agentLinkToEmail: any
    clientIndustry: any
    clientType: string
    contacts: Array<CompanyAndressContact>
    defaultPaymentMethod: any
    domain: string
    login: string
    maxAgents: number
    name: string
    password: string
    removeOfflineTime: number
    services: any
    workingDays: Array<WorkDay>;
    constructor() { }

}