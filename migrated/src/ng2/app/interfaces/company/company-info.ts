import { CompanyAndress } from './company-address';
import { CompanyAndressContact } from './company-address-contact';

export interface CompanyInfo {
    primaryAddress: any; 
    addresses: Array<CompanyAndress>;
    contacts: Array<CompanyAndressContact>;
}