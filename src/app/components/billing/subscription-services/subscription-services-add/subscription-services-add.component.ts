import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionServices } from '../class/subscription-services';
import { SubscriptionServicesStateService } from 'src/app/states/subscription-services/subscription-services-state.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { Tax } from 'src/class/taxes/tax';
import { NonContractServices } from '../../non-contract-services/class/non-contract-service';
import { NonContractServiceValidate } from '../../non-contract-services/class/non-contract-service-validate';
import { SubscriptionServicesService } from 'src/app/services/subscription-services/subscription-services.service';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { PreloaderTicketComponent } from '../../../shared/preloader-ticket/preloader-ticket.component';
import { DisabledBtnDirective as DisabledBtnDirective_1 } from '../../../../directives/disabled-btn/disabled-btn.directive';
import { GlNumbersDropDownComponent } from '../../../inventory/gl-numbers-drop-down/gl-numbers-drop-down.component';
import { TaxesComponent } from '../../../shared/taxes/taxes.component';
import { ToFixedDirective } from '../../../../directives/to-fixed/to-fixed.directive';
import { numberDirective } from '../../../../directives/number/number.directive';
import { MatErrorComponent } from '../../../shared/mat-error/mat-error.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-subscription-services-add',
    templateUrl: './subscription-services-add.component.html',
    styleUrls: ['./subscription-services-add.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, ReactiveFormsModule, NgClass, MatErrorComponent, numberDirective, ToFixedDirective, TaxesComponent, GlNumbersDropDownComponent, DisabledBtnDirective_1, PreloaderTicketComponent]
})
export class SubscriptionServicesAddComponent implements OnInit, OnDestroy {
  sub: Subscription = new Subscription();
  modelForm: UntypedFormGroup;
  submitted: boolean = false;
  defaultSelectedTax: Array<Tax> = [];
  showAdd: boolean = false;
  glNumbers: Array<GlNumber> = [];
  @ViewChild('addBtn', { static: false }) addBtn: DisabledBtnDirective;
  constructor(
    private subscriptionServicesService: SubscriptionServicesService,
    private taxesStateService: TaxesStateService,
    private subscriptionServicesStateService: SubscriptionServicesStateService,
    public cd: ChangeDetectorRef,
    public formBuilder: UntypedFormBuilder,
    private glNumberStateService: GlNumberStateService,
    private glNumberService: GlNumberService
  ) { }

  ngOnInit() {
    let getShowAsideForAdd = this.subscriptionServicesStateService.showAsideForAdd.subscribe(data => {
      this.showAdd = true;
      if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
    })
    this.sub.add(getShowAsideForAdd);
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.setDefaultTaxes(data);
    })
    this.sub.add(getOnTaxess);
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
      glNumberId: [null]
    })
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnGlNumbers);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.modelForm.controls["glNumberId"].setValue(res.id)
    })
  }
  onSelectGlNumbers(data) {
    this.modelForm.controls["glNumberId"].setValue(data.id)
  }
  glDropDownItemName(item) {
    return `${item["glNumber"]} - ${(item["description"] && item["description"].length > 0) ? item["description"]
      : "No description"}`;
  }
  private setDefaultTaxes(lsitTaxes) {
    let taxes = lsitTaxes.filter(item => item.isDefault === true);
    this.modelForm.controls["taxIds"].setValue(taxes.map(item => item.id))
    this.defaultSelectedTax = taxes;
    this.taxesStateService.setTaxesFromtEdit(taxes);
  }
  onTaxesChange(data) {
    this.modelForm.controls["taxIds"].setValue(data.map(item => item.id))
  }
  add() {
    this.submitted = true;
    if (this.modelForm.invalid) {
      return;
    }
    this.addBtn.setDisabled(true);

    this.subscriptionServicesService.addService({ ...this.modelForm.value, glNumberId: this.modelForm.value.glNumberId ? this.modelForm.value.glNumberId : undefined }).subscribe(data => {
      this.subscriptionServicesStateService.fastAddService(data);
      this.addBtn.setDisabled(false);
      this.close();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  close() {
    this.submitted = false;
    this.showAdd = false;
    this.modelForm.reset();
    this.modelForm.patchValue({ rate: 0 })
    if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  get f2() {
    return this.modelForm.controls;
  }
}
