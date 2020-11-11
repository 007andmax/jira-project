import { InvoiceCompanyParent } from './invoice-company-parent';

export class InvoiceCompany {
    default: boolean;
    id: string;
    parent: InvoiceCompanyParent;
    tags: Array<any>;
}