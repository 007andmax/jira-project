import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_CARD, REMOVE_RECORD } from 'src/app/const/confirm';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { Card } from '../class/card';
import { ManageCardsStateService } from 'src/app/states/manage-cards/manage-cards-state.service';

@Component({
  selector: 'app-manage-cards-table',
  templateUrl: './manage-cards-table.component.html',
  styleUrls: ['./manage-cards-table.component.scss']
})
export class ManageCardsTableComponent implements OnInit, OnDestroy {
  @Input() item: Card;
  @Output() onSelectRecord = new EventEmitter<any>();
  togglePassword: boolean = false;
  sub: Subscription = new Subscription();
  constructor(
    private manageCardsStateService: ManageCardsStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    private toastrService: ToastrService,
    private appStateService: AppStateService) { }

  ngOnInit() {

  }
  edit() {
    this.manageCardsStateService.openAsideForEdit(this.item);
  }
  sendNotification() {

  }
  getExpiredStatus() {
    let current = new Date().getTime();
    let expired = new Date(Number(`20${this.item.expiryDate.substring(0, 2)}`), Number(`${this.item.expiryDate.substring(2, 4)}`) - 1, 1).getTime();
    if (expired - current < 1000 * 60 * 60 * 24 * 30 && expired - current > 0) return 'EXPIRING_SOON';
    if (expired > current) return 'ACTIVE';
    return 'EXPIRED';

  }
  parseExpiredDate() {
    let current = new Date().getTime();
    let expired = new Date(Number(`20${this.item.expiryDate.substring(0, 2)}`), Number(`${this.item.expiryDate.substring(2, 4)}`) - 1, 1).getTime();
    if (expired - current < 1000 * 60 * 60 * 24 * 30 && expired - current > 0) return 'Expiring soon';
    if (expired > current) return 'Active';
    return 'Expired';
  }
  delete() {
    this.confirmStateService.setConfirmAction(REMOVE_CARD);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = 'Delete Card';
    modalRef.componentInstance.message = `Are you sure you want to remove this card?`;
    this.manageCardsStateService.setCardForRemove(this.item);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

