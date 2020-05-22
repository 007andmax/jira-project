import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketsListService } from '../../../services/tickets-list.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { TicketStateService } from '../../services/ticket-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { REMOVE_UPDATE_TICKET } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';

@Component({
  selector: 'app-ticket-profile-updates-service',
  templateUrl: './ticket-profile-updates-service.component.html',
  styleUrls: ['./ticket-profile-updates-service.component.scss']
})
export class TicketProfileUpdatesServiceComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  
  constructor(public ticketsListService: TicketsListService,
    private confirmStateService: ConfirmStateService,
    private ticketStateService: TicketStateService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }
  public trackById(index, item) {
    return item.id;
  }
}
