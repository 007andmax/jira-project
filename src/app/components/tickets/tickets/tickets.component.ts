import { MergeTicketsComponent } from './';
import { TicketsHeaderComponent } from './';
import { TicketsTableComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { fadeInAnimation } from 'src/app/animations';

@Component({
  standalone: true,
  imports: [MergeTicketsComponent, TicketsHeaderComponent, TicketsTableComponent, CommonModule],
    selector: 'app-tickets',
    templateUrl: './tickets.component.html',
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' },
    styleUrls: ['./tickets.component.scss'],
    standalone: true
})
export class TicketsComponent implements OnInit, OnDestroy {
  listType: string = "USERS";
  sub: Subscription = new Subscription();
  constructor(private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.listType = this.ticketsStateService.getListType();
    let getOnInitFilter = this.ticketsStateService.getOnInitFilter().subscribe((data: any) => {
      this.listType = data.listType;
    })
    this.sub.add(getOnInitFilter);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
