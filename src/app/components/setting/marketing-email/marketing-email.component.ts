import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_SUBSCRIPTION_TYPIES } from 'src/app/const/confirm';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { MarketingSubscriptionTypeComponent } from './marketing-subscription-type/marketing-subscription-type.component';

@Component({
  selector: 'marketing-email',
  templateUrl: './marketing-email.component.html',
  styleUrls: ['./marketing-email.component.scss']
})
export class MarketingEmailComponent implements OnInit, OnDestroy {

  activeTab: string = "companyIndustry";
  @ViewChild("subscriptionType") subscriptionType: MarketingSubscriptionTypeComponent;

  constructor(private crmStateService: CrmStateService,
    private confirmStateService: ConfirmStateService,
    private marketingEmailStateService: MarketingEmailStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal) { }

  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
  }

  create() {
    this.subscriptionType.toggleShowAdd(true);

  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  ngOnDestroy(): void {
    $('body').removeClass('page-settings');
  }
  getSelectedCount() {
    return this.marketingEmailStateService.getListSubscriptionTypeForRemove().length;

  }
  onSelect(data) {
    if (data.event.target.checked) {
      this.marketingEmailStateService.getListSubscriptionTypeForRemove().push(data.item);
    } else {
      let list = this.marketingEmailStateService.getListSubscriptionTypeForRemove();
      let index = list.findIndex(item => item.id === data.item.id);
      if (index > -1) list.splice(index, 1);
      this.marketingEmailStateService.setListSubscriptionTypeForRemove(list);
    }
    this.cd.detectChanges();
  }
  removeList() {
    this.confirmStateService.setConfirmAction(DELETE_SUBSCRIPTION_TYPIES);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Subscriptions`;
  }

}
