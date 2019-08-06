import { CreateRecurringTicketsProduct } from './create-recurring-tickets-product';
import { CreateRecurringTicketsService } from './create-recurring-tickets-service';

export class CreateRecurringTickets {
    description: string = null;
    cronExpression: string = null;
    requireUpdate: boolean = null;
    quickClose: boolean = null;
    createTask: boolean = null;
    company: string = null;
    tags: Array<String> = null;
    agent: String = null;
    assignedUsers: Array<String> = null;
    products: Array<CreateRecurringTicketsProduct> = null;
    services: Array<CreateRecurringTicketsService> = null;
    startDate: number = null;
    constructor() {

    }
    public getCompany() {
        return this.company;
    }
    public getCrone() {
       return this.cronExpression;
    }

    public setDefaultCron() {
        this.cronExpression = '0 0 0 ? * MON *';
    }
    public setRequireUpdate(requireUpdate) {
        this.requireUpdate = requireUpdate;
    }
    public setQuickClose(quickClose) {
        this.quickClose = quickClose;
    }

    public setCreateTask(createTask) {
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
        this.agent = '';
    }
    public setAgents(agent) {
        console.log('agent', agent);
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
    public setDescription(description) {
        this.description = description;
    }
    public resetProducts() {
        this.products = [];
    }

    public clearProducts() {
        this.products = null
    }

    public addProdct(product) {
        this.products.push(product);
    }
    public clearServices() {
        this.services = null
    }
    public resetServices() {
        this.services = [];
    }
    public addService(service) {
        this.services.push(service);
    }

}