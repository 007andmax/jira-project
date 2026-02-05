import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SubscriptionServices } from '../class/subscription-services';
import { Subscription } from 'rxjs';
import { SubscriptionServicesService } from 'src/app/services/subscription-services/subscription-services.service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { SubscriptionServicesStateService } from 'src/app/states/subscription-services/subscription-services-state.service';
import { Tax } from 'src/class/taxes/tax';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';

@Component({
  selector: 'app-subscription-services-edit',
  templateUrl: './subscription-services-edit.component.html',
  styleUrls: ['./subscription-services-edit.component.scss']
})
export class SubscriptionServicesEditComponent implements OnInit, OnDestroy {
  open: boolean = false;
  modelForm: UntypedFormGroup;
  submitted: boolean = false;
  service: SubscriptionServices;
  selectedTaxes: Array<Tax> = [];
  selectedGlNumber: GlNumber;
  glNumbers: Array<GlNumber> = [];
  sub: Subscription = new Subscription();
  @ViewChild('editService', { static: false }) editService: DisabledBtnDirective;
  @Output() onClose = new EventEmitter<any>();
  constructor(
    private subscriptionServicesService: SubscriptionServicesService,
    private taxesStateService: TaxesStateService,
    private subscriptionServicesStateService: SubscriptionServicesStateService,
    private glNumberStateService: GlNumberStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private glNumberService: GlNumberService,
    private confirmStateService: ConfirmStateService,
    public formBuilder: UntypedFormBuilder,) { }

  ngOnInit() {
    let getShowAsideForEdit = this.subscriptionServicesStateService.showAsideForEdit.subscribe(data => {
      this.service = data;
      this.modelForm.patchValue({ name: this.service.name, rate: this.service.rate, taxIds: this.service.taxIds, updateServicePricesInContracts: this.service.updateServicePricesInContracts, glNumberId: this.service.glNumberId })
      if (this.glNumbers.length > 0) this.selectedGlNumber = this.glNumbers.find(item => item.id == this.service.glNumberId);
      if (this.taxesStateService.getTaxes().length > 0) this.selectedTaxes = this.taxesStateService.getTaxes().filter(item => this.service.taxIds.some(tax => tax == item.id));
      this.open = true;
    })
    this.sub.add(getShowAsideForEdit);
    this.modelForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
      ],
      rate: [0,
        [Validators.required]
      ],
      taxIds: [
        []
      ],
      glNumberId: [""],
      updateServicePricesInContracts: [false]
    })
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
    })
    this.sub.add(getOnGlNumbers);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) this.save();
    })
    this.sub.add(getConfirm);
  }
  onChangeUpdateServicePricesInContracts(event) {
    this.modelForm.controls["updateServicePricesInContracts"].setValue(event.target.checked);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  onTaxesChange(data) {
    this.selectedTaxes = data;
    this.modelForm.controls["taxIds"].setValue(data.map(item => item.id))
  }
  glDropDownItemName(item) {
    return `${item["glNumber"]} - ${(item["description"] && item["description"].length > 0) ? item["description"]
      : "No description"}`;
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.modelForm.controls["glNumberId"].setValue(res.id)
      this.selectedGlNumber = res;
    })
  }
  onSelectGlNumbers(data) {
    this.selectedGlNumber = data;
    this.modelForm.controls["glNumberId"].setValue(data.id)
  }
  public onSave() {
    if (this.modelForm.invalid) {
      return;
    }
    if (this.modelForm.value.updateServicePricesInContracts) {
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.header = 'Change Rate';
      modalRef.componentInstance.message = `Are you sure you want to apply a new service price to all contracts where the service is used?`;
    } else {
      this.save();
    }
  }
  save() {
    this.editService.setDisabled(true);
    this.subscriptionServicesService.editService(this.service.id, this.modelForm.value).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.subscriptionServicesStateService.fastEditService(data);
      this.close();
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  close() {
    this.editService.setDisabled(false);
    this.submitted = false;
    this.open = false;
    this.modelForm.reset();
    this.onClose.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  get f2() {
    return this.modelForm.controls;
  }
}
