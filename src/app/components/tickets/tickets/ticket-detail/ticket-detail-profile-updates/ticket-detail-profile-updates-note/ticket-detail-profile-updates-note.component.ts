import { Component, OnInit, ViewChildren } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL } from 'src/app/const/confirm';
import { TicketProfileUpdatesNoteComponent } from '../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-note/ticket-profile-updates-note.component';
import { TicketDetailProfileUpdatesNoteInfoComponent } from './ticket-detail-profile-updates-note-info/ticket-detail-profile-updates-note-info.component';
import { TicketDetailProfileUpdatesNoteItemComponent } from './ticket-detail-profile-updates-note-item/ticket-detail-profile-updates-note-item.component';

@Component({
  selector: 'ticket-detail-profile-updates-note',
  templateUrl: './ticket-detail-profile-updates-note.component.html',
  styleUrls: ['./ticket-detail-profile-updates-note.component.scss']
})
export class TicketDetailProfileUpdatesNoteComponent extends TicketProfileUpdatesNoteComponent {
  @ViewChildren("updatesNoteItem") updatesNoteItem: TicketDetailProfileUpdatesNoteItemComponent;

  public isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `The ticket update containing a note will become inaccessible. Continue with permanent deletion?`;
  }
}
