import { CompanyInfo } from './company-info';
import { CompanyStatistic } from './company-statistic';
import { CompanyLogo } from './company-logo';

export interface Company {
    accountType: string;
    allowCreateTags: boolean;
    clientIndustry: any;
    clientType: string;
    companyInfo: CompanyInfo;
    companyStatistic: CompanyStatistic;
    cover: any;
    createdAt: number;
    defaultPaymentMethod: string;
    deletedAt: number;
    description: string;
    domain: string;
    emailAlias: string;
    id: string;
    isDefault: boolean;
    logo: CompanyLogo;
    name: string;
    paymentTerms: number;
    status: string;
    techLeadId: any;
    type: any;
}