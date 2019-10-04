import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';

import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { WorkDay } from './work-day';
import { CompanyService } from './company-service';
import { CompanyProfileContact } from '../interfaces/company-profile-contact';
import { CompanyProfileAddress } from '../interfaces/company-profile-address';
import { Weeks } from '../../shared/interval/config/enums';

export class CompanyProfile {
    accountNumber: any;
    addresses: Array<CompanyProfileAddress>;
    agentLinkToEmail: any = null;
    clientIndustry: any = {};
    clientType: string = '';
    contacts: Array<CompanyProfileContact>;
    defaultPaymentMethod: any = null;
    domain: string;
    login: string = "";
    maxAgents: number = 0;
    name: string;
    password: string = "";
    removeOfflineTime: number = 30;
    services: Array<CompanyService>;
    workingDays: Array<WorkDay>;
    constructor() {
        

        let contact: CompanyProfileContact = {
            firstName: "",
            phoneNumbers: [{
                number: "",
                typeNumber: "OFFICE"
            }],
            lastName: "",
            primaryEmail: "",
            subscription: {
                invoice: true,
                ticket: true
            }
        }
        let address: CompanyProfileAddress = {
            isPrimary: true,
            phoneNumbers: contact.phoneNumbers
        }
        this.addresses = [address];
        this.contacts = [contact];
        this.workingDays = Weeks.map((item) => new WorkDay(item.toUpperCase(),0,0))
    }

}