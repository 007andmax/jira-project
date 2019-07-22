import { RecurringTicketCompany } from '../interfaces/recurring-ticket-company';
import { RecurringTicketAgent } from '../interfaces/recurring-ticket-agent';
import { Tag } from 'src/ng2/app/interfaces/tag/tag';
import { RecurringTicketUser } from '../interfaces/recurring-ticket-user';
import { ServiceRecurringTicket } from '../interfaces/service-recurring-ticket';
import { ProductRecurringTicket } from '../interfaces/product-recurring-ticket';

export class RecurringTicket {
    id: string;
    description: string;
    cronExpression: string;
    requireUpdate: boolean;
    quickClose: boolean;
    createTask: boolean;
    suspended: boolean;
    agreementNeedsChange: boolean;
    company: RecurringTicketCompany;
    agent: RecurringTicketAgent;
    tags: Array<Tag>;
    assignedUsers: Array<RecurringTicketUser>;
    services:Array<ServiceRecurringTicket>;
    products: Array<ProductRecurringTicket>;
    startDate: number;
    constructor ()
 {

 }}