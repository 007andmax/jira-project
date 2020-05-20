import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketsListService } from '../../../services/tickets-list.service';

@Component({
  selector: 'app-ticket-profile-updates-service',
  templateUrl: './ticket-profile-updates-service.component.html',
  styleUrls: ['./ticket-profile-updates-service.component.scss']
})
export class TicketProfileUpdatesServiceComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  editMode:boolean = false;
  constructor(public ticketsListService: TicketsListService,) { }

  ngOnInit() {
  }
  public trackByIndex(index, item) {
    return index;
  }
}
