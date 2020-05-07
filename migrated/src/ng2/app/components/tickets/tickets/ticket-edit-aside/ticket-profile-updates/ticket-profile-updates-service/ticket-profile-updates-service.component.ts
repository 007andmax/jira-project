import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketsListService } from '../../../services/tickets-list.service';
import * as moment from "moment";
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { TicketStateService } from '../../services/ticket-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { REMOVE_UPDATE_TICKET, REMOVE_UPDATE_TICKET_SERVICE } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';

@Component({
  selector: 'app-ticket-profile-updates-service',
  templateUrl: './ticket-profile-updates-service.component.html',
  styleUrls: ['./ticket-profile-updates-service.component.scss']
})
export class TicketProfileUpdatesServiceComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  editMode:boolean = false;
  constructor(public ticketsListService: TicketsListService,
    private confirmStateService: ConfirmStateService,
    private ticketStateService:TicketStateService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }
 
}
