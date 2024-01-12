import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL } from 'src/app/const/confirm';
import { TicketDetailProfileUpdatesNoteItemComponent } from './ticket-detail-profile-updates-note-item/ticket-detail-profile-updates-note-item.component';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketsListService } from '../../../services/tickets-list.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ticket-detail-profile-updates-note',
  templateUrl: './ticket-detail-profile-updates-note.component.html',
  styleUrls: ['./ticket-detail-profile-updates-note.component.scss']
})
export class TicketDetailProfileUpdatesNoteComponent implements OnInit {
  @ViewChild("updatesNoteItem", { static: true }) updatesNoteItem: TicketDetailProfileUpdatesNoteItemComponent;
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
  public isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `The ticket update containing a note will become inaccessible. Continue with permanent deletion?`;
  }
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  public trackById(index, item) {
    return item.id;
  }
}
