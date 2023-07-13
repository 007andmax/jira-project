import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketsListService } from '../../../services/tickets-list.service';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_FOREVER, REMOVE_UPDATE_TICKET } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { TicketStateService } from '../../services/ticket-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'app-ticket-profile-updates-note',
  templateUrl: './ticket-profile-updates-note.component.html',
  styleUrls: ['./ticket-profile-updates-note.component.scss']
})
export class TicketProfileUpdatesNoteComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  @Output() onRemove = new EventEmitter();
  @Input() idTicket: string;
  @Input() isBlockChange: boolean;
  constructor(public ticketsListService: TicketsListService,
    public confirmStateService: ConfirmStateService,
    public ticketStateService: TicketStateService,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public modalService: NgbModal,) { }

  ngOnInit() {

  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `The ticket update containing a note will become inaccessible. Continue with permanent deletion?`;
  }
}
