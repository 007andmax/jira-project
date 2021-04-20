import { CompanyAndress } from './company-address';
import { CompanyAndressContact } from './company-address-contact';
import { WorkDay } from '../../components/companies/class/work-day';

export interface CompanyInfo {
    primaryAddress: any; 
    addresses: Array<CompanyAndress>;
    contacts: Array<CompanyAndressContact>;
    workingTime:Array<WorkDay>;
    reputation: number;
}