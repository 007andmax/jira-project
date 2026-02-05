import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MarketingSubscriptionType } from 'src/app/components/setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_SUBSCRIPTION_TYPE } from 'src/app/const/confirm';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';

@Component({
  selector: 'app-marketing-subscriptions-aside-item-edit',
  templateUrl: './marketing-subscriptions-aside-item-edit.component.html',
  styleUrls: ['./marketing-subscriptions-aside-item-edit.component.scss']
})
export class MarketingSubscriptionsAsideItemEditComponent implements OnInit {
  @Input() subscription: MarketingSubscriptionType;
  constructor(private marketingEmailService: MarketingEmailService,
    private confirmStateService: ConfirmStateService,
    private marketingEmailStateService: MarketingEmailStateService,
    private modalService: NgbModal,) { }

  ngOnInit() {
  }
  onEditSubscription(event) {
    if (this.subscription.isInitEdit) {
      if (this.subscription.name.length === 0 || this.subscription.disableUpdate || this.subscription.isInitRequest) return;
      this.subscription.setIsInitRequest(true);
      this.marketingEmailService.editSubscriptionType(this.subscription.id, this.subscription.name).pipe(map((res) => res),
        catchError(error => of(undefined)))
        .subscribe(data => {
          this.subscription.setIsInitRequest(false);
          this.subscription.onInitEdit(false);
          if (event) event.target.blur();
        }, err => {
          this.subscription.setIsInitRequest(false);
        })
    }
  }
  remove() {
    this.confirmStateService.setConfirmAction(DELETE_SUBSCRIPTION_TYPE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Subscription`;
    modalRef.componentInstance.message = `Are you sure want to delete this subscription?`;
    this.marketingEmailStateService.setSubscriptionTypeForRemove(this.subscription);
  }
}
