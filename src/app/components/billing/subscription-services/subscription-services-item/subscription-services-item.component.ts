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
import { GlNumber } from 'src/class/gl-number/gl-number';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { SubscriptionServicesService } from 'src/app/services/subscription-services/subscription-services.service';

@Component({
  selector: 'app-subscription-services-item',
  templateUrl: './subscription-services-item.component.html',
  styleUrls: ['./subscription-services-item.component.scss']
})
export class SubscriptionServicesItemComponent implements OnInit, OnDestroy {
  @Input() service: SubscriptionServices;
  @Output() onEditService = new EventEmitter<any>();
  selectedGlNumber: GlNumber;
  glNumbers: Array<GlNumber> = [];
  sub: Subscription = new Subscription();
  constructor(
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private subscriptionServicesStateService: SubscriptionServicesStateService,
    private taxesStateService: TaxesStateService,
    private permissionsService: PermissionsService,
    private glNumberStateService: GlNumberStateService,
    private glNumberService: GlNumberService,
    private subscriptionServicesService: SubscriptionServicesService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) {
      this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
      if (this.glNumbers.length > 0) this.selectedGlNumber = this.glNumbers.find(item => item.id == this.service.glNumberId);
    }
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
      if (this.glNumbers.length > 0) this.selectedGlNumber = this.glNumbers.find(item => item.id == this.service.glNumberId);
    })
    this.sub.add(getOnGlNumbers);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  ngDoCheck() {
    if (this.glNumbers.length > 0) this.selectedGlNumber = this.glNumbers.find(item => item.id == this.service.glNumberId);
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
  glDropDownItemName(item) {
    return `${item["glNumber"]} - ${(item["description"] && item["description"].length > 0) ? item["description"]
      : "No description"}`;
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.service.glNumberId = res.id;
      this.onChangeDefault();
    })
  }
  onSelectGlNumbers(data) {
    this.selectedGlNumber = data;
    this.service.glNumberId = data ? data.id : null;
    this.onChangeDefault();
  }
  onChangeDefault() {
    this.subscriptionServicesService.editService(this.service.id, this.service.getDataForUpdate()).subscribe(data => {
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
