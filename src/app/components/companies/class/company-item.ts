import { Company } from "src/app/interfaces/company/company";
import { CompanyInfo } from "src/app/interfaces/company/company-info";
import { CompanyLogo } from "src/app/interfaces/company/company-logo";
import { CompanyStatistic } from "src/app/interfaces/company/company-statistic";

export class CompanyItem implements Company {
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
    techLeadId: string;
    type: any;
    selected: boolean = false;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }

}