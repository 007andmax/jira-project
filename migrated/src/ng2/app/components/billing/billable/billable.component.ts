import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BillableService } from 'src/ng2/app/services/billable/billable.service';
import { BillableProfile } from './class/billable-profile';
import { CompanyFilterTop } from '../../companies/class/copany-filter-top';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { AppService } from 'src/ng2/app/states/app/app.service';
import { BillableRealTimeService } from 'src/ng2/app/states/billable/billable-real-time.service';

@Component({
  selector: 'billable',
  templateUrl: './billable.component.html',
  styleUrls: ['./billable.component.scss'],
  providers: [TicketsListService]
})
export class BillableComponent implements OnInit {
  list: Array<BillableProfile> = [];
  reqList: Array<BillableProfile> = [];
  filter: Array<CompanyFilterTop> = [new CompanyFilterTop('name', 'ASC'),
  new CompanyFilterTop('countTickets', ''),
  new CompanyFilterTop('salesPerson', ''),
  new CompanyFilterTop('total', '')];
  showPreloader: boolean = true;
  count:number = 0;
  constructor(private billableService: BillableService,
    private companiesStateService: CompaniesStateService,
    public ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
    private appService: AppService,
    private billableRealTimeService: BillableRealTimeService,
    private usersStateService: UsersStateService) { }

  ngOnInit() {
    if (this.appService.getIsInit()) this.getList();
    this.appService.getOnInit().subscribe(data => {
      this.getList();
    })
    this.billableRealTimeService.changeBillableCount.subscribe(data => {
      if (data.action == 'LEFT_PANEL_COUNTS') {
        this.count = data.BILLABLE;
      }
    })
    this.billableRealTimeService.changeBillable.subscribe(data => {
      if (data.action == 'TICKET_LOCKED') {
        let key = Object.keys(data.data)[0];
        let tickets = data.data[key];
        tickets.forEach(item => {
          this.list.forEach(itemList => {
            let indexTicket = itemList.tickets.findIndex(ticket => ticket.id === item);
            if (indexTicket > -1) itemList.tickets[indexTicket].lockedBy = new Date().getTime();
          })
          this.reqList.forEach(itemList => {
            let indexTicket = itemList.tickets.findIndex(ticket => ticket.id === item);
            if (indexTicket > -1) itemList.tickets[indexTicket].lockedBy = new Date().getTime();
          })
        });
      }
      if (data.action == 'TICKET_UNLOCKED') {
        data.data.forEach(item => {
          this.list.forEach(itemList => {
            itemList.tickets.forEach(ticket => {
              if (ticket.id === item) ticket.lockedBy = null;
            });

          })
          this.reqList.forEach(itemList => {
            itemList.tickets.forEach(ticket => {
              if (ticket.id === item) ticket.lockedBy = null;
            });

          })
        });
      }
    })
    this.getCounters();
  }
  public getCounters() {
    this.billableService.getCounters().subscribe((data:any) => {
      console.log("data",data);
      this.count = data.BILLABLE;
    })
  }
  onSearch(event) {
    console.log("event", event.target.value);
    if (event.target.value.length > 0) {
      this.list = this.reqList.filter(item => item.name.toLowerCase().includes(event.target.value.toLowerCase()));
    } else {
      this.list = JSON.parse(JSON.stringify(this.reqList));
    }

  }
  private getList() {
    this.billableService.getBillable().subscribe(data => {
      //  console.log("data",data);
      for (const key in data) {
        let company = this.companiesStateService.getCompanies().find(item => item.id === key);

        let salesPerson = this.usersStateService.getAllUsers().find(item => item.id === company.techLeadId);
        this.list.push(new BillableProfile(key, data[key].tickets, company.name, this.ticketsListService.getUserName(salesPerson)));
        this.reqList.push(new BillableProfile(key, data[key].tickets, company.name, this.ticketsListService.getUserName(salesPerson)));

      }
      this.onFilterName();
      this.showPreloader = false;
      console.log("this.list", this.list);
    })
  }
  onFilter(field) {

    let index = this.filter.findIndex(item => item.field === field);
    if (index > -1) {
      let sort = this.filter[index].filter;
      if (field === 'name') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterName();
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }

      }
      if (field === 'countTickets') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {

          this.filter[index].filter = 'ASC';
          this.onFilterCountTickets();

        } else {

          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }


      }
      if (field === 'salesPerson') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterSalesPerson();
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }


      }

      if (field === 'total') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterTotal();
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }


      }

    }
    this.cd.detectChanges();
  }
  private onFilterTotal() {
    this.list.sort((a, b) => (a.total > b.total) ?
      1 : ((b.total > a.total) ? -1 : 0));
  }
  private onFilterSalesPerson() {
    this.list.sort((a, b) => (a.salesPerson.toLowerCase() > b.salesPerson.toLowerCase()) ?
      1 : ((b.salesPerson.toLowerCase() > a.salesPerson.toLowerCase()) ? -1 : 0));
  }
  private onFilterCountTickets() {
    this.list.sort((a, b) => (a.countTickets > b.countTickets) ?
      1 : ((b.countTickets > a.countTickets) ? -1 : 0));
  }
  private onFilterName() {
    this.list.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  private clearFilter() {
    this.filter.forEach(item => item.filter = '');
  }
  public trackById(index, item) {
    return item.id;
  }
}
