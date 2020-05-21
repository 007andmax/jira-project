import { Component, OnInit, OnDestroy } from '@angular/core';
import { TitleListType } from './class/title-list-type';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tickets-header',
  templateUrl: './tickets-header.component.html',
  styleUrls: ['./tickets-header.component.scss']
})
export class TicketsHeaderComponent implements OnInit, OnDestroy {
  titleListTypes: Array<TitleListType> = [new TitleListType('All Tickets', 'ALL'),
  new TitleListType('Unassigned', 'UNASSIGNED'),
  new TitleListType('Open', 'OPEN'),
  new TitleListType('Close', 'CLOSED'),
  new TitleListType('On Hold', 'ON_HOLD'),
  new TitleListType('Trash', 'TRASH'),
  new TitleListType('Spam', 'SPAM'),
  new TitleListType('My Tickets', 'USERS'),
  new TitleListType('Recurring tickets Open', 'RECURRING_TICKETS_OPEN'),
  new TitleListType('Recurring tickets Closed', 'RECURRING_TICKETS_CLOSED')];
  title: string = 'My Tickets';
  sub: Subscription = new Subscription();
  count = 0;
  selectedListType: TitleListType = new TitleListType('My Tickets', 'USERS');
  constructor(private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    let getOnInitFilter = this.ticketsStateService.getOnInitFilter().subscribe(data => {
      this.selectedListType = this.titleListTypes.find(item => item.type === data.listType);
      if (this.selectedListType) this.title = `${this.selectedListType.title} (${this.count})`
    })
    this.sub.add(getOnInitFilter);
    this.ticketsStateService.getOnInitCount().subscribe(data => {
      this.count = data;
      this.title = `${(this.selectedListType) ? this.selectedListType.title : ''} (${this.count})`;
    })
  }
  onAddTicket() {
    this.ticketsStateService.onToggleAddTicket();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
