import { CreateRecurringTickets } from './create-recurring-tickets';
import { RecurringTicket } from '../../class/recurring-ticket';

export class Validate  {
    company: boolean = true;
    interval: boolean = true;
    constructor () {}
    public getCompany () {
    return this.company;
    }
    public getInterval () {
        return this.interval;
    }
    public resetCompany () {
        this.company = true;
    }
    public resetInterval () {
        this.interval = true;
    }
    public companyNoValid () {
        this.company = false;
    }
    public intervalNoValid () {
        this.interval = false;
    }
    public checkValidat(create: CreateRecurringTickets) {
        this.resetCompany();
        this.resetInterval();
        if (create.getCompany() === null) this.companyNoValid();
        if (create.getCrone() === null) this.intervalNoValid();

    }
 
}