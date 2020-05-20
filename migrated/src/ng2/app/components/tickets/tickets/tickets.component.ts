import { Component, OnInit, OnDestroy } from '@angular/core';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit, OnDestroy {
  listType: string = "USERS";
  sub: Subscription = new Subscription();
  constructor(private ticketsStateService: TicketsStateService,
    private ticketsService:TicketsService,) { }


  ngOnInit() {
    let getOnInitFilter = this.ticketsStateService.getOnInitFilter().subscribe((data:any) => {
      this.listType = data.listType;
    })
    this.sub.add(getOnInitFilter);
    this.ticketsService.getActualNumber().subscribe((data:any) => {
      this.ticketsStateService.onInitActualNumber(data.number);
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
