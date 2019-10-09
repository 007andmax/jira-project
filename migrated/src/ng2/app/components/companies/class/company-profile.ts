import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';

import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { WorkDay } from './work-day';
import { CompanyService } from './company-service';
import { CompanyProfileContact } from './company-profile-contact';
import { CompanyProfileAddress } from './company-profile-address';
import { Weeks } from '../../shared/interval/config/enums';

export class CompanyProfile {
    accountNumber: any;
    addresses: Array<CompanyProfileAddress>;
    agentLinkToEmail: any = null;
    clientIndustry: any = {};
    clientType: string = '';
    contacts: Array<CompanyProfileContact>;
    defaultPaymentMethod: any = null;
    description: string;
    domain: string;
    login: string = "";
    maxAgents: number = 0;
    name: string;
    password: string = "";
    paymentMethods: string;
    paymentTerms: number;
    serviceType: string;
    removeOfflineTime: number = 30;
    services: Array<CompanyService>;
    workingDays: Array<WorkDay>;
    techLeadId: string;
    constructor() {

        let contact: CompanyProfileContact = new CompanyProfileContact();
        let address: CompanyProfileAddress = new CompanyProfileAddress();
        address.shortVersion(contact);
        this.addresses = [address];
        this.contacts = [contact];
        this.workingDays = Weeks.map((item) => new WorkDay(item.toUpperCase(), 0, 0))
    }
    public fullVersion() {
        let contact: CompanyProfileContact = new CompanyProfileContact();
        contact.fullVersion();
        let address: CompanyProfileAddress = new CompanyProfileAddress();
        address.fullVersion();
        this.agentLinkToEmail = null;
        this.clientIndustry = {
            name: ""
        };
        this.clientType = '';
        this.description = '';
        this.domain = '';
        this.login = '';
        this.name = '';
        this.paymentMethods = '';
        this.paymentTerms = 0;
        this.serviceType = '';
        this.techLeadId = '';
        this.addresses = [address];
        this.contacts = [contact];
        this.workingDays = Weeks.map((item) => new WorkDay(item.toUpperCase(), 0, 0))

    }

}