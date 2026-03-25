import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { MOVE_TO_SPAM_TICKET_DETAIL, MOVE_TO_TRASH_TICKET_DETAIL } from 'src/app/const/confirm';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsListService } from '../../services/tickets-list.service';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'ticket-detail-header',
  templateUrl: './ticket-detail-header.component.html',
  styleUrls: ['./ticket-detail-header.component.scss'],
  providers: [TicketsListService, TicketsPermissionsService]
})
export class TicketDetailHeaderComponent implements OnInit, OnDestroy {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() onAddUpdate = new EventEmitter();
  @Output() onClaimTicket = new EventEmitter();
  @Output() onMoveToSpam = new EventEmitter();
  @Output() onMoveToTrash = new EventEmitter();
  @Output() onToggleRigthPanel = new EventEmitter();
  @ViewChild('update_closeBtn', { static: true }) update_closeBtn: DisabledBtnDirective;
  isUpdateAndClose: boolean = false;
  currentUser: CurrentUser;
  dateTxt: string = "";
  interval;
  hour: number = 0;
  minute: number = 0;
  second: number = 0;
  movedWay: boolean = false;
  sub = new Subscription();
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(private usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    public ticketsPermissionsService: TicketsPermissionsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public ticketsService: TicketsService,
    private ticketStateService: TicketStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public ticketsListService: TicketsListService,) { }


  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    if (this.usersStateService.getCurrentUser()) this.currentUser = this.usersStateService.getCurrentUser();
    let getOnGetCurrentuser = this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
    })
    this.sub.add(getOnGetCurrentuser);
    this.interval = setInterval(() => {
      if (this.second == 59) {
        if (this.minute == 59) {
          this.hour += 1;
          this.minute = 0;
          this.second = 0;
        } else {
          this.minute += 1;
          this.second = 0;
        }
      } else {
        this.second += 1;
      }
      this.dateTxt = `${this.parseDate(this.hour)} hr : ${this.parseDate(this.minute)} min : ${this.parseDate(this.second)} sec`;
      this.cd.detectChanges();
    }, 1000);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === MOVE_TO_SPAM_TICKET_DETAIL) {
          this.onMoveToSpam.emit(data);
        }
        if (this.confirmStateService.getConfirmAction() === MOVE_TO_TRASH_TICKET_DETAIL) {
          this.onMoveToTrash.emit(this.movedWay);
        }
      }
    })
    this.sub.add(getConfirm);
  }
  isAddNoteForCustomerUser() {
    return this.customerPortalStateService.checkEditTicket(this.usersStateService.getCurrentUser(), this.ticketProfile.createdUserId, this.ticketProfile.companyId);
  }
  checkClose() {
    let completeServices = true;
    let completeProducts = true;
    this.ticketProfile.updates.forEach(update => {
      if (update.type !== 'MIXED') {
        if (completeServices) completeServices = (update.services.find(item => !item.completed) ? false : true);
        if (completeProducts) completeProducts = (update.products.find(item => !item.completed) ? false : true);
      }
    });
    return completeServices && completeProducts;
  }
  close() {
    if (!this.checkClose()) return;
    this.update_closeBtn.setDisabled(true);
    this.isUpdateAndClose = true;
    this.ticketsService.updateTicket(this.getDataForClose(), true).subscribe(data => {
      this.ticketStateService.fastCloseTicket();
    }, err => {
      this.isUpdateAndClose = false;
      this.update_closeBtn.setDisabled(false);
    })
  }
  public resetClosedBtn() {
    this.isUpdateAndClose = false;
    this.update_closeBtn.setDisabled(false);
  }
  public getDataForClose() {
    return {
      note: "Ticket has been closed",
      type: "NOTE",
      noteType: "PUBLIC",
      shares: [],
      ticket: { id: this.ticketProfile.id },
      attachments: []
    }
  }
  moveIntoSpam() {
    this.confirmStateService.setConfirmAction(MOVE_TO_SPAM_TICKET_DETAIL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Mark as spam`;
    modalRef.componentInstance.message = `Are you sure you want to mark the ticket as spam?`;
  }
  moveToTrash(movedWay) {
    this.movedWay = movedWay;
    this.confirmStateService.setConfirmAction(MOVE_TO_TRASH_TICKET_DETAIL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Move to trash`;
    modalRef.componentInstance.message = `Are you sure you want to move the ticket to Trash?`;
  };

  claimTicket() {
    this.onClaimTicket.emit(null);
  }
  parseDate(data) {
    return (data < 0) ? `0${data}` : data;
  }
  setNoteType(type) {
    this.ticketStateService.setNoteType(type);
  }
  addUpdate(type) {
    this.onAddUpdate.emit(type);
  }
  toggleRigthPanel() {
    this.onToggleRigthPanel.emit(null);
  }
  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
    this.sub.unsubscribe();
  }
}
