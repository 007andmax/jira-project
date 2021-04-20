import { CompanyProfileAddress } from '../../../companies/class/company-profile-address';

export class InvoiceDtoBillTo extends CompanyProfileAddress {
    country: string;
    id:string;
    longCity: string;
    longState: string;
    shortCity: string;
    shortState: string;
}