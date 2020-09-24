import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TicketProfileUpdate } from '../../class/ticket-profile-update';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketProfile } from '../../class/ticket-profile';
import { NotificationStateService } from 'src/ng2/app/components/shared/notification/services/notification-state.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_UPDATE_TICKET, REMOVE_UPDATE_TICKET_SERVICE, REMOVE_UPDATE_TICKET_PRODUCT } from 'src/ng2/app/const/confirm';
import { TicketStateService } from '../services/ticket-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-profile-updates',
  templateUrl: './ticket-profile-updates.component.html',
  styleUrls: ['./ticket-profile-updates.component.scss']
})
export class TicketProfileUpdatesComponent implements OnInit, OnDestroy {
  @Input() updates: Array<TicketProfileUpdate>;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() onFetchUpdates = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  showLoadMoreUpdates = true;
  showPreloader: boolean = false;
  constructor(private ticketsService: TicketsService,
    private confirmStateService: ConfirmStateService,
    private ticketStateService: TicketStateService,
    public cd: ChangeDetectorRef,
    private notificationStateService: NotificationStateService,) { }
  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      console.log("data", data);
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET) {
          this.removeUpdate();
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_SERVICE) {
          this.removeService();
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_PRODUCT) {
          this.removeProduct();
        }

      }
    })
    this.sub.add(getConfirm);
  }

  removeService() {
    this.ticketsService.removeService(this.ticketProfile.id, this.ticketStateService.getUpdateForRemove().id, this.ticketStateService.getServiceForRemove().id).subscribe(data => {
    })
  }
  removeProduct() {
    this.ticketsService.removeProduct(this.ticketProfile.id, this.ticketStateService.getUpdateForRemove().id, this.ticketStateService.getProductForRemove().id).subscribe(data => {
    })
  }
  removeUpdate() {
    this.ticketsService.deleteUpdate(this.ticketProfile.id, this.ticketStateService.getUpdateForRemove().id).subscribe(data => {
      this.notificationStateService.oninitShowNotification(`The ticket update containing a note has been deleted`);
    })
  }
  fetchUpdates() {
    this.showPreloader = true;
    this.ticketsService.fetchUpdates(this.ticketProfile).subscribe((resp: any) => {
      this.onFetchUpdates.emit(resp);
      this.showPreloader = false;
      this.showLoadMoreUpdates = false;
      this.cd.detectChanges();
    })
  }
  getCountUpdates() {

    return (this.showLoadMoreUpdates) ? this.updates.length + this.ticketProfile.unloadedUpdates : this.updates.length;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackByIndex(index, item) {
    return index;
  }
  public trackById(index, item) {
    return item.id;
  }
}
