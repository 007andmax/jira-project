import { Component, OnInit, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';
import { Subscription } from 'rxjs';
import { GlNumberStateService } from 'src/ng2/app/states/gl-number/gl-number-state.service';
import { DefaultServices } from '../class/default-service';
import { DefaultServiceValidate } from '../class/default-service-validate';
import { GlNumberService } from 'src/ng2/app/services/gl-number/gl-number.service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { Tax } from 'src/ng2/app/interfaces/service/tax';
import { DisabledBtnDirective } from 'src/ng2/app/directives/disabled-btn.directive';
import { DefaultServicesStateService } from 'src/ng2/app/states/default-services/default-services-state.service';

@Component({
  selector: 'app-default-services-add',
  templateUrl: './default-services-add.component.html',
  styleUrls: ['./default-services-add.component.scss']
})
export class DefaultServicesAddComponent implements OnInit {
  service: DefaultServices = new DefaultServices();
  glNumbers: Array<GlNumber> = [];
  sub: Subscription = new Subscription();
  validate: DefaultServiceValidate = new DefaultServiceValidate();
  defaultSelectedTax: Array<Tax> = [];
  showAdd: boolean = false;
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  constructor(private glNumberStateService: GlNumberStateService,
    private defaultServicesService: DefaultServicesService,
    private taxesStateService: TaxesStateService,
    private defaultServicesStateService: DefaultServicesStateService,
    public cd: ChangeDetectorRef,
    private glNumberService: GlNumberService,) { }

  ngOnInit() {
    this.defaultServicesStateService.getShowAsideForAdd().subscribe(data => {
      this.showAdd = true;
      this.service.onInitForAdd();
    })
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
      this.cd.detectChanges();
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
    this.defaultServicesService.addService(this.service.getDataForAdd()).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.close();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  onSelectGlNumbers(data) {

    this.service.glNumber = data;
  }
  close() {
    this.showAdd = false;
    this.service = new DefaultServices();
    this.validate = new DefaultServiceValidate();
    if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
  }
}
