import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { REMOVE_UPDATE_TICKET_DETAIL_SERVICE, REMOVE_UPDATE_TICKET_DETAIL_PRODUCT, REMOVE_UPDATE_TICKET_DETAIL } from 'src/app/const/confirm';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { TicketProfileUpdate } from '../../class/ticket-profile-update';
import { TicketProfile } from '../../class/ticket-profile';
import { Subscription } from 'rxjs';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketsListService } from '../../services/tickets-list.service';

@Component({
  selector: 'ticket-detail-profile-updates',
  templateUrl: './ticket-detail-profile-updates.component.html',
  styleUrls: ['./ticket-detail-profile-updates.component.scss'],
  providers: [TicketsPermissionsService, TicketsListService]
})
export class TicketDetailProfileUpdatesComponent implements OnInit, OnDestroy {
  @Input() updates: Array<TicketProfileUpdate>;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() onFetchUpdates = new EventEmitter<any>();
  public infiniteScrollDisabled = true;
  page: number = 0;
  sub: Subscription = new Subscription();
  showLoadMoreUpdates = false;
  showPreloader: boolean = true;
  container: any;
  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService,
    public confirmStateService: ConfirmStateService,
    private ticketStateService: TicketStateService,
    public cd: ChangeDetectorRef,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private elRef: ElementRef,
    public ticketsPermissionsService: TicketsPermissionsService,) { }

  ngOnInit() {
    this.container = document.body.querySelector(".ticket-detail-page-content__body");
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_DETAIL) {
          this.removeUpdate();
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_DETAIL_SERVICE) {
          this.removeService();
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_DETAIL_PRODUCT) {
          this.removeProduct();
        }

      }
    })
    this.sub.add(getConfirm);
  }
  isAddNoteForCustomerUser() {
    return this.customerPortalStateService.checkEditTicket(this.usersStateService.getCurrentUser(), this.ticketProfile.createdUserId, this.ticketProfile.companyId);
  }
  removeService() {
    this.ticketsService.removeService(this.ticketProfile.id, this.ticketStateService.getUpdateForRemove().id, this.ticketStateService.getServiceForRemove().id).subscribe(data => {
      this.ticketStateService.removeUpdate(this.ticketStateService.getUpdateForRemove());
    })
  }
  removeProduct() {
    this.ticketsService.removeProduct(this.ticketProfile.id, this.ticketStateService.getUpdateForRemove().id, this.ticketStateService.getProductForRemove().id).subscribe(data => {
      this.ticketStateService.removeUpdate(this.ticketStateService.getUpdateForRemove());
    })
  }
  removeUpdate() {
    this.ticketsService.deleteUpdate(this.ticketProfile.id, this.ticketStateService.getUpdateForRemove().id).subscribe(data => {
      this.ticketStateService.removeUpdate(this.ticketStateService.getUpdateForRemove());
    })
  }
  getUpdates(id) {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.showLoadMoreUpdates = true;
    this.ticketsService.getUpdates(id, this.page).subscribe((resp: any) => {
      this.onFetchUpdates.emit(resp);
      this.showPreloader = false;
      this.showLoadMoreUpdates = false;
      this.infiniteScrollDisabled = false;
      if (resp.length < 10) this.ticketsListService.setBlockList(true);
      this.page += 1;
      this.cd.detectChanges();
    })
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getUpdates(this.ticketProfile.id);
  }
  getCountUpdates() {
    return (this.showLoadMoreUpdates) ? this.updates.length + this.ticketProfile.unloadedUpdates : this.updates.length;
  }
  public resetShowLoadMoreUpdates() {
    this.showLoadMoreUpdates = true;
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
