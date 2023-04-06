import { Component, OnInit } from '@angular/core';
import { TicketsListService } from '../../../services/tickets-list.service';
import { CompanyInfoHistoryComponent } from '../../../ticket-edit-aside-company-info/company-info-history/company-info-history.component';
import * as moment from "moment";
@Component({
  selector: 'ticket-detail-contact-details-history',
  templateUrl: './ticket-detail-contact-details-history.component.html',
  styleUrls: ['./ticket-detail-contact-details-history.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailContactDetailsHistoryComponent extends CompanyInfoHistoryComponent {



}
