import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { User } from 'src/app/components/users/class/user';
import { MOVE_TO_SPAM_TICKET, MOVE_TO_TRASH_TICKET } from 'src/app/const/confirm';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsListService } from '../../services/tickets-list.service';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';

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
  currentUser: CurrentUser;
  dateTxt: string = "";
  interval;
  hour: number = 0;
  minute: number = 0;
  second: number = 0;
  movedWay: boolean = false;
  sub = new Subscription();
  constructor(private usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    public ticketsPermissionsService: TicketsPermissionsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public ticketsService: TicketsService,
    public ticketsListService: TicketsListService,) { }


  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.currentUser = this.usersStateService.getCurrentUser();
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
    })
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
        if (this.confirmStateService.getConfirmAction() === MOVE_TO_SPAM_TICKET) {
          this.onMoveToSpam();
        }
        if (this.confirmStateService.getConfirmAction() === MOVE_TO_TRASH_TICKET) {
          this.onMoveToTrash();
        }
      }
    })
    this.sub.add(getConfirm);
  }
  onMoveToSpam() {
    if (this.currentUser.isOwner) {
      this.ticketsService.markAsSpamTicket(this.ticketProfile.id, false).subscribe(res => {
      })

    } else {
      this.ticketsService.reportAsSpamTicket(this.ticketProfile.id, false).subscribe(res => {
      })
    }
  }
  moveIntoSpam() {
    this.confirmStateService.setConfirmAction(MOVE_TO_SPAM_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to mark the ticket as spam?`;
  }
  moveToTrash(movedWay) {
    this.movedWay = movedWay;
    this.confirmStateService.setConfirmAction(MOVE_TO_TRASH_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to move the ticket to Trash?`;
  };
  onMoveToTrash() {
    this.ticketsService.trashTicket(this.ticketProfile.id, this.movedWay).subscribe(res => {
    })
  }
  claimTicket() {
    this.onClaimTicket.emit(null);
  }
  parseDate(data) {
    return (data < 0) ? `0${data}` : data;
  }
  addUpdate(type) {
    this.onAddUpdate.emit(type);
  }
  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
    this.sub.unsubscribe();
  }
}
