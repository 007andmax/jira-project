import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_SUBSCRIPTION_TYPE, DELETE_SUBSCRIPTION_TYPIES } from 'src/app/const/confirm';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingEmailRealTimeService } from 'src/app/states/marketing-email/marketing-email-real-time.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { MarketingSubscriptionType } from './class/marketing-subscription-type';
import { MarketingSubscriptionTypeFilter } from './class/marketing-subscription-type-filter';

@Component({
  selector: 'marketing-subscription-type',
  templateUrl: './marketing-subscription-type.component.html',
  styleUrls: ['./marketing-subscription-type.component.scss']
})
export class MarketingSubscriptionTypeComponent implements OnInit, OnDestroy {
  marketingSubscriptionList: Array<MarketingSubscriptionType> = [];
  showAdd: boolean = false;
  filter: MarketingSubscriptionTypeFilter = new MarketingSubscriptionTypeFilter();
  showPreloader: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private marketingEmailService: MarketingEmailService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private marketingEmailStateService: MarketingEmailStateService,
    private marketingEmailRealTimeService: MarketingEmailRealTimeService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_SUBSCRIPTION_TYPE) {
          this.onRemoveSubscription(this.marketingEmailStateService.getSubscriptionTypeForRemove().id);
        }
        if (this.confirmStateService.getConfirmAction() === DELETE_SUBSCRIPTION_TYPIES) {
          this.onRemoveSubscriptions();
        }
      }
    })
    this.sub.add(getConfirm);

    this.marketingEmailService.getList().subscribe((data: any) => {
      this.marketingSubscriptionList = data.map(item => new MarketingSubscriptionType(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    let changeCrmArray = this.marketingEmailRealTimeService.changeCrmArray.subscribe(data => {
      console.log("data", data);
      if (data.action === "CUSTOM_SUBSCRIPTION_CREATED") this.marketingSubscriptionList.push(new MarketingSubscriptionType(data.data));
      if (data.action === "CUSTOM_SUBSCRIPTION_DELETED") {
        let index = this.marketingSubscriptionList.findIndex(item => item.id === data.data);
        if (index > -1) this.marketingSubscriptionList.splice(index, 1);
      }
      if (data.action === "CUSTOM_SUBSCRIPTION_EDITED") {
        let index = this.marketingSubscriptionList.findIndex(item => item.id === data.data.id);
        if (index > -1) this.marketingSubscriptionList[index].onUpdate(data.data);
      }
      this.marketingSubscriptionList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.cd.detectChanges();

    })
    this.sub.add(changeCrmArray);
  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.marketingSubscriptionList);
  }
  onEditSubscription(item, event) {
    if (item.isInitEdit) {
      if (item.length === 0 || item.disableUpdate) return;
      this.marketingEmailService.editSubscriptionType(item.id, item.name).pipe(map((res) => res),
        catchError(error => of(undefined)))
        .subscribe(data => {
          item.onInitEdit(false);
          console.log("event", event);
          if (event) event.target.blur();
        })
    }
  }
  onRemoveSubscriptions() {
    forkJoin(this.marketingEmailStateService.getListSubscriptionTypeForRemove().map(item => this.marketingEmailService.removeSubscriptionType(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
          this.cd.detectChanges();
        },
        error => {
        }
      );
  }
  onRemoveSubscription(id) {
    this.marketingEmailService.removeSubscriptionType(id).subscribe(data => {

    })
  }
  onSelect(event, item) {
    if (event.target.checked) {
      this.marketingEmailStateService.getListSubscriptionTypeForRemove().push(item);
    } else {
      let list = this.marketingEmailStateService.getListSubscriptionTypeForRemove();
      let index = list.findIndex(item => item.id === item.id);
      if (index > -1) list.splice(index, 1);
      this.marketingEmailStateService.setListSubscriptionTypeForRemove(list);
    }
    this.cd.detectChanges();
  }
  removeSubscription(item) {
    this.confirmStateService.setConfirmAction(DELETE_SUBSCRIPTION_TYPE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Remove Subscription`;
    this.marketingEmailStateService.setSubscriptionTypeForRemove(item);
  }
  ngOnDestroy(): void {
    this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
    this.sub.unsubscribe();
  }


}
