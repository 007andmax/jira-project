import { Component, OnInit } from '@angular/core';
import { DraftEmail } from 'src/app/components/shared/draft-email/class/draft-email';
import { RemoteSession } from 'src/app/components/support/class/remote-sessions';
import { USERS_TO_EDIT_UPDATE } from 'src/app/const/add-users-notify';
import { ModalAddUsersNotifyComponent } from 'src/app/services/modal/modal-add-users-notify/modal-add-users-notify.component';
import { TicketProfileProduct } from '../../class/ticket-profile-product';
import { TicketProfileService } from '../../class/ticket-profile-service';
import { TicketProfileShare } from '../../class/ticket-profile-share';
import { TicketProfileUpdate } from '../../class/ticket-profile-update';
import { TicketsListService } from '../../services/tickets-list.service';
import { TicketProfileFormUpdateComponent } from '../ticket-profile-form-update/ticket-profile-form-update.component';

@Component({
  selector: 'ticket-profile-edit-form-update',
  templateUrl: './ticket-profile-edit-form-update.component.html',
  styleUrls: ['./ticket-profile-edit-form-update.component.scss'],
  providers: [TicketsListService]
})
export class TicketProfileEditFormUpdateComponent extends TicketProfileFormUpdateComponent {
  product: TicketProfileProduct;
  service: TicketProfileService;
  note: TicketProfileUpdate;
  updateId: string;

  ngOnInit() {
    this.tab = null;
    this.currentUser = this.usersStateService.getCurrentUser();
    let onEditUpdate = this.ticketStateService.onEditUpdate.subscribe(data => {
      console.log("data", data);
      if (data.type === "PRODUCT") this.product = data.update;
      if (data.type === "SERVICE") this.service = data.update;
      if (data.type === "NOTE") this.note = data.update;

      this.updateId = data.updateId;
      this.setTab(data.type);
    })
    this.sub.add(onEditUpdate);
  }
  public onChangeChat(event) {
    this.note.note = event.target.value.replace(/\n/g, '<br/>');
  }
  public onPastChat(value) {
    this.note.note = value.replace(/\n/g, '<br/>');
  }
  saveNote() {
    this.isUpdate = true;
    this.updateMobileBtn.setDisabled(true);
    this.ticketsService.updateNote(this.ticketProfile.id, this.updateId, this.note.note).subscribe(data => {
      this.isUpdate = false;
      this.updateMobileBtn.setDisabled(false);
      this.close();
    })
  }
  close() {
    this.tab = null;
    this.onClosed.emit(null);
  }
}
