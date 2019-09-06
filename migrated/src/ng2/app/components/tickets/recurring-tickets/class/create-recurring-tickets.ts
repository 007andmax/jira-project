import { CreateRecurringTicketsProduct } from './create-recurring-tickets-product';
import { CreateRecurringTicketsService } from './create-recurring-tickets-service';
import { RecurringTicket } from './recurring-ticket';

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
    public setStartDate(day, month, year, timeOffset) {
        let current = new Date();


        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            /* let date = new Date(year, month - 1, day);
             console.log('date.getTime()',date.getTime());
             console.log('date.getTimezoneOffset()',date.getTimezoneOffset());
             console.log('timeOffset',timeOffset);
             this.startDate = date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + timeOffset;
            
             console.log('this.startDate',new Date(this.startDate));*/
            /* let date = new Date(year, month - 1, day, current.getHours(), current.getMinutes());
             let startDateTime = date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + timeOffset;
            let startDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + timeOffset);
            startDateTime= (startDateTime - (startDate.getHours() * 3600000));
             this.startDate = startDate.getTime();
             console.log('this.startDate',this.startDate);*/

            let d = new Date();
            let dt = + new Date(year, month - 1, day); // timestamp from calendar
            let dt2 = new Date(dt - (d.getTimezoneOffset() * 60000/* dont touch*/) - 10800000 /* timezone.timeOffset */).getTime();
            this.startDate = dt2;
        } else {
            let d = new Date();
            let dt = + new Date(d.getFullYear(), d.getMonth(), d.getDate());
            let dt2 = new Date(dt - (d.getTimezoneOffset() * 60000) - 10800000).getTime();
            this.startDate = dt2;
            /*  let date = new Date(year, month - 1, day, current.getHours(), current.getMinutes());
  
              this.startDate = date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + timeOffset;*/
            console.log('this.startDate', this.startDate);

        }

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

    public checkForEdit(ticketForEdit: RecurringTicket) {
        if (ticketForEdit.company.name === this.company) this.setCompany(null);
        if (ticketForEdit.cronExpression === this.cronExpression) this.setCronExpression(null);
        if (ticketForEdit.description === this.description) this.setDescription(null);

    }

}