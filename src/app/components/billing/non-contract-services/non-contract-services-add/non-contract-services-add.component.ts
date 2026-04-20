import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { Subscription } from 'rxjs';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { NonContractServices } from '../class/non-contract-service';
import { NonContractServiceValidate } from '../class/non-contract-service-validate';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { Tax } from 'src/app/interfaces/service/tax';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { NonContractServicesStateService } from 'src/app/states/non-contract-services/non-contract-services-state.service';
import { PreloaderTicketComponent } from '../../../shared/preloader-ticket/preloader-ticket.component';
import { DisabledBtnDirective as DisabledBtnDirective_1 } from '../../../../directives/disabled-btn/disabled-btn.directive';
import { GlNumbersDropDownComponent } from '../../../inventory/gl-numbers-drop-down/gl-numbers-drop-down.component';
import { TaxesComponent } from '../../../shared/taxes/taxes.component';
import { numberDirective } from '../../../../directives/number/number.directive';
import { MatErrorComponent } from '../../../shared/mat-error/mat-error.component';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-non-contract-services-add',
    templateUrl: './non-contract-services-add.component.html',
    styleUrls: ['./non-contract-services-add.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass, FormsModule, MatErrorComponent, numberDirective, TaxesComponent, GlNumbersDropDownComponent, DisabledBtnDirective_1, PreloaderTicketComponent]
})
export class NonContractServicesAddComponent implements OnInit, OnDestroy {
  service: NonContractServices = new NonContractServices();
  glNumbers: Array<GlNumber> = [];
  sub: Subscription = new Subscription();
  validate: NonContractServiceValidate = new NonContractServiceValidate();
  defaultSelectedTax: Array<Tax> = [];
  showAdd: boolean = false;
  @ViewChild('addBtn', { static: false }) addBtn: DisabledBtnDirective;
  constructor(private glNumberStateService: GlNumberStateService,
    private nonContractServicesService: NonContractServicesService,
    private taxesStateService: TaxesStateService,
    private nonContractServicesStateService: NonContractServicesStateService,
    public cd: ChangeDetectorRef,
    private glNumberService: GlNumberService,) { }

  ngOnInit() {
    let getShowAsideForAdd = this.nonContractServicesStateService.getShowAsideForAdd().subscribe(data => {
      this.showAdd = true;
      this.service.onInitForAdd();
      if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
    })
    this.sub.add(getShowAsideForAdd);
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnGlNumbers);
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.setDefaultTaxes(data);
    })
    this.sub.add(getOnTaxess);

  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  onChangeName() {
    if (this.service.name.length > 3 && this.service.name.length < 100) this.validate.resetName();
  }
  onChangeRate(event) {
    this.service.rate = Number(event.target.value);
    if (this.service.rate >= 0) this.validate.resetRate();
  }
  private setDefaultTaxes(lsitTaxes) {
    let taxes = lsitTaxes.filter(item => item.isDefault === true);
    this.service.taxes = taxes;
    this.defaultSelectedTax = taxes;
    this.taxesStateService.setTaxesFromtEdit(taxes);
  }
  onTaxesChange(data) {
    this.service.taxes = data;
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.service.glNumber = res;
    })
  }
  add() {
    if (!this.validate.isValidate(this.service)) return;
    this.addBtn.setDisabled(true);
    this.nonContractServicesService.addService(this.service.getDataForAdd()).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.close();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  glDropDownItemName(item) {
    return `${item["glNumber"]} - ${(item["description"] && item["description"].length > 0) ? item["description"]
      : "No description"}`;
  }
  onSelectGlNumbers(data) {

    this.service.glNumber = data;
  }
  close() {
    this.showAdd = false;
    this.service = new NonContractServices();
    this.validate = new NonContractServiceValidate();
    if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
