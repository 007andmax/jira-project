import { CreateRecurringTicketsProduct } from './create-recurring-tickets-product';
import { CreateRecurringTicketsService } from './create-recurring-tickets-service';

export class CreateRecurringTickets {
    description: string;
    cronExpression: string;
    requireUpdate: boolean;
    quickClose: boolean;
    createTask: boolean;
    company: string;
    tags: Array<String>;
    agent: String;
    assignedUsers: Array<String>;
    products: Array<CreateRecurringTicketsProduct>;
    services: Array<CreateRecurringTicketsService>;
    startDate: number;
    constructor() {

    }
public setRequireUpdate (requireUpdate) {
    this.requireUpdate = requireUpdate;
}
public setQuickClose (quickClose) {
    this.quickClose = quickClose;
}

public setCreateTask (createTask) {
    this.createTask = createTask;
}


    public clearTehUsers() {
        this.assignedUsers = [];
    }
    public addAssignedUsers(item) {
        this.assignedUsers.push(item);
    }

    public clearTags() {
        this.tags = [];
    }
    public addTag(tag) {
        this.tags.push(tag);
    }

    public clearAgents() {
        this.agent ='';
    }
    public setAgents(agent) {
        console.log('agent',agent);
        this.agent = agent;
    }
    public setCronExpression(cronExpression) {
        this.cronExpression = cronExpression;
    }
    public setCompany(company) {
        this.company = company;
    }
    public setStartDate(day, month, year) {
        this.startDate = new Date(year, month - 1, day).getTime();
    }
    public setDescription (description) {
        this.description = description;
    }
    public clearProducts() {
        this.products = [];
    }
    public addProdct(product) {
        this.products.push(product);
    }
    public clearServices() {
        this.services = [];
    }
    public addService(service) {
        this.services.push(service);
    }

}