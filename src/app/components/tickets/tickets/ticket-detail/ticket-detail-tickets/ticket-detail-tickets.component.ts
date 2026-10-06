
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { Ticket } from '../../../class/ticket';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsFilter } from '../../class/tickets-filter';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketDetailTicketsStatusComponent } from './ticket-detail-tickets-status/ticket-detail-tickets-status.component';
import { TicketDetailTicketsDetailsComponent } from './ticket-detail-tickets-details/ticket-detail-tickets-details.component';
import { TicketsListService } from '../../services/tickets-list.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  standalone: true,
  imports: [TicketDetailTicketsStatusComponent, InfiniteScrollModule, CommonModule],
  selector: 'ticket-detail-tickets',
  templateUrl: './ticket-detail-tickets.component.html',
  styleUrls: ['./ticket-detail-tickets.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailTicketsComponent extends TicketDetailTicketsDetailsComponent {

}
