import { Component, OnInit } from '@angular/core';
import { DraftEmail } from 'src/app/components/shared/draft-email/class/draft-email';
import { RemoteSession } from 'src/app/components/support/class/remote-sessions';
import { TicketProfileProduct } from '../../class/ticket-profile-product';
import { TicketProfileService } from '../../class/ticket-profile-service';
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
  updateId: string;
  ngOnInit() {
    if (this.appService.checkMobile()) this.tab = null;
    this.currentUser = this.usersStateService.getCurrentUser();
    this.supportStateService.getHandleSendMode().subscribe(data => {
      let draftEmail: DraftEmail = new DraftEmail();
      draftEmail.setContent(data.message);
      draftEmail.setSubject(data.subject);
      draftEmail.setRecipients(data.recipients);
      this.draftEmailService.sendMessage(draftEmail).subscribe((data) => {
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      })
    })
    let oneTimeConnectionArray = this.devicesRealTimeService.oneTimeConnectionArray.subscribe(newChange => {
      if (newChange.action === 'ONE_TIME_DOWNLOADED' || newChange.action === 'ONE_TIME_INSTALLED' || newChange.action === 'ONE_TIME_CONNECTION_OPEN' || newChange.action === 'ONE_TIME_URL_GENERATED' || newChange.action === 'ONE_TIME_URL_OPEN' || newChange.action === 'ONE_TIME_ONLINE' || newChange.action === 'ONE_TIME_OFFLINE') {
        if (newChange.data.oneTime) {
          if (this.remoteSession && this.remoteSession.id === newChange.data.id) this.remoteSession = new RemoteSession(newChange.data);
        }
      }
      if (newChange.action === 'ONE_TIME_DELETED' || newChange.action === 'ONE_TIME_UNINSTALLED') {
        newChange.data.forEach(element => {
          if (this.remoteSession && this.remoteSession.id === element) this.remoteSession = null;
        });
      }
      this.cd.detectChanges();
    })
    this.sub.add(oneTimeConnectionArray);
    let getOnTicketClosed = this.ticketStateService.getOnTicketClosed().subscribe(data => {
      if (this.remoteSession) this.removeSession();
    })
    this.sub.add(getOnTicketClosed);
    let getOnEditTicket = this.ticketsStateService.getOnEditTicket().subscribe(data => {
      if (this.remoteSession) this.removeSession();
    })
    this.sub.add(getOnEditTicket);

    let onEditUpdate = this.ticketStateService.onEditUpdate.subscribe(data => {
      console.log("data", data);
      if (data.type === "PRODUCT") this.product = data.update;
      if (data.type === "SERVICE") this.service = data.update;
      this.updateId = data.updateId;
      this.setTab(data.type);
    })
    this.sub.add(onEditUpdate);
  }
  close() {
    this.tab = null;
    this.onClosed.emit(null);
  }
}
