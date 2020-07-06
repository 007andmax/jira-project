import { BillableProfileTicket } from './billable-profile-ticket';

export class BillableProfile {
    id: string;
    tickets: Array<BillableProfileTicket>;
    name:string;
    countTickets:number = 0;
    salesPerson:string = '';
    total:number = 0;
    constructor(id,tickets,name,salesPerson) {
        this.id = id;
        this.tickets = tickets.map(item => {
            return new BillableProfileTicket(item);
        });
        this.name = (name) ? name : '';
        this.countTickets = this.tickets.length;
        this.tickets.forEach(item => {
            this.total += item.sum;
          })
        
        this.salesPerson = salesPerson;

    }
    public addTicket(data) {
        this.tickets.push(new BillableProfileTicket(data));
    }
    public updateCountTickets() {
        this.countTickets = this.tickets.length;
    }
    public updateTotal() {
        this.total = 0;
        this.tickets.forEach(item => {
            this.total += item.sum;
          })
    }
   
}