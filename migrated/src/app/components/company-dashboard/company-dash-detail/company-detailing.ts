import { Tag } from 'src/app/interfaces/tag/tag';
import { CompanyPrimaryContact } from '../../companies/class/company-primary-contact';
import { CompanyProfileAddress } from '../../companies/class/company-profile-address';

export class CompanyDetaill {
    name: string;
    addresses: Array<CompanyProfileAddress>;
    addresses_name: string;
    phoneNumber: string;
    totalTickets: number;
    averageResponseTime: string;
    serviceType: string;
    domain: string;
    clientIndustry: string;
    tags: Array<Tag>;
    mapSrc: string;
    primaryContact: CompanyPrimaryContact;
    reputation?: number = 0;
    clientType: string;
    description: string;
}