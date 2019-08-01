import { RecurringTicketCompany } from '../interfaces/recurring-ticket-company';
import { RecurringTicketAgent } from '../interfaces/recurring-ticket-agent';
import { Tag } from 'src/ng2/app/interfaces/tag/tag';
import { RecurringTicketUser } from '../interfaces/recurring-ticket-user';
import { ServiceRecurringTicket } from '../interfaces/service-recurring-ticket';
import { ProductRecurringTicket } from '../interfaces/product-recurring-ticket';
import { ServiceErrors } from './service-errors';

export class RecurringTicket {
    id: string;
    description: string;
    cronExpression: string;
    requireUpdate: boolean;
    quickClose: boolean;
    createTask: boolean;
    suspended: boolean;
    agreementNeedsChange: boolean;
    serviceErrors:Array<ServiceErrors> = [];
    noValid:boolean = false;
    company: RecurringTicketCompany;
    agent: RecurringTicketAgent;
    tags: Array<Tag>;
    assignedUsers: Array<RecurringTicketUser>;
    services:Array<ServiceRecurringTicket>;
    products: Array<ProductRecurringTicket>;
    startDate: number;
    constructor (data)
 {
    this.id = data.id;
    this.description = data.description;
    this.cronExpression = data.cronExpression;
    this.requireUpdate = data.requireUpdate;
    this.quickClose = data.quickClose;
    this.createTask = data.createTask;
    this.suspended = data.suspended;
    this.agreementNeedsChange = data.agreementNeedsChange;
    this.company  = data.company;
    this.agent = data.agent;
    this.tags = data.tags;
    this.assignedUsers = data.assignedUsers;
    this.services = data.services;
    this.products = data.products;
    this.startDate = data.startDate;
    this.setServiceErrors(data.serviceErrors);
    if (this.setServiceErrors.length > 0) this.noValid = true;
 }
 private setServiceErrors (data) {
    for (var prop in data) {
            
        this.serviceErrors.push(new ServiceErrors(prop,data[prop]));
       }
 }

}