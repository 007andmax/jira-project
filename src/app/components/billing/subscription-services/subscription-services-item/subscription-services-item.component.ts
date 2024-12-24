import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SubscriptionServices } from '../class/subscription-services';
import { Subscription } from 'rxjs';
import { REMOVE_SUBSCRIBE_SERVICE } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { SubscriptionServicesStateService } from 'src/app/states/subscription-services/subscription-services-state.service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { SubscriptionServicesCheckUseComponent } from '../subscription-services-check-use/subscription-services-check-use.component';

@Component({
  selector: 'app-subscription-services-item',
  templateUrl: './subscription-services-item.component.html',
  styleUrls: ['./subscription-services-item.component.scss']
})
export class SubscriptionServicesItemComponent implements OnInit, OnDestroy {
  @Input() service: SubscriptionServices;
  @Output() onEditService = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  constructor(
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private subscriptionServicesStateService: SubscriptionServicesStateService,
    private taxesStateService: TaxesStateService,
    private permissionsService: PermissionsService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {

  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  getSelectedTaxNames(taxes) {
    let list = this.taxesStateService.getTaxes().filter(item => taxes.some(tax => tax == item.id))
    return list && list.map((tax) => {
      return tax.name + ' ' + tax.rate + '%';
    }).join(', ') || 'No taxes';
  };
  edit() {
    this.onEditService.emit(this.service);
  }
  delete() {
    this.confirmStateService.setConfirmAction(REMOVE_SUBSCRIBE_SERVICE);
    const modalRef = this.modalService.open(SubscriptionServicesCheckUseComponent, { windowClass: 'xs-modal user-modal', container: "app-subscription-services", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.service = this.service;
    this.subscriptionServicesStateService.setServiceForRemove(this.service);
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
