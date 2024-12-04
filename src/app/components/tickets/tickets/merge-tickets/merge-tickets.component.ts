import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Ticket } from '../../class/ticket';
import * as moment from 'moment';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-merge-tickets',
  templateUrl: './merge-tickets.component.html',
  styleUrls: ['./merge-tickets.component.scss']
})
export class MergeTicketsComponent implements OnInit, OnDestroy {
  tickets: Array<Ticket> = [];
  opened: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef
  ) { }


  ngOnInit() {
    let onMegeTickets = this.ticketsStateService.onMegeTickets.subscribe(data => {
      this.opened = true;
      this.tickets = this.ticketsStateService.getTicketsForMerge();
      this.cd.detectChanges();
    })
    this.sub.add(onMegeTickets);
  }
  getCreatAt(item) {
    let date = new Date(item.createdAt);
    return `${moment(new Date(date)).format('DD MMM YYYY')}`;
  }
  getCompanyName(item) {
    if (!item.company) return '';
    let find = this.companiesStateService.getCompanies().find(item => item.id === item.company.id);
    return (find) ? find.name : '';
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
