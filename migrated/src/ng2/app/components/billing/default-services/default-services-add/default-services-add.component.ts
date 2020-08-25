import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';
import { Subscription } from 'rxjs';
import { GlNumberStateService } from 'src/ng2/app/states/gl-number/gl-number-state.service';
import { SelectSearchComponent } from '../../../shared/select-search/select-search.component';
import { DefaultServices } from '../class/default-service';
import { DefaultServiceValidate } from '../class/default-service-validate';
import { GlNumberService } from 'src/ng2/app/services/gl-number/gl-number.service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { Tax } from 'src/ng2/app/interfaces/service/tax';

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
  @ViewChild('glNumberSelect') glNumberSelect: SelectSearchComponent;
  @Output() onClose = new EventEmitter<any>();
  constructor(private glNumberStateService: GlNumberStateService,
    private defaultServicesService: DefaultServicesService,
    private taxesStateService: TaxesStateService,
    private glNumberService: GlNumberService,) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
    })
    this.sub.add(getOnGlNumbers);
    if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.setDefaultTaxes(data);
    })
    this.sub.add(getOnTaxess);
    this.service.onInitForAdd();
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  onChangeName() {
    if (this.service.name != "") this.validate.resetName();
  }
  onChangeRate(event) {
    this.service.rate = Number(event.target.value);
    console.log("this.service.rate",this.service.rate);
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
  save() {
    if (!this.validate.isValidate(this.service)) return;
    this.defaultServicesService.addService(this.service.getDataForAdd()).subscribe(data => {
      this.close();
    })
  }
  onSelectGlNumbers(data) {

    this.service.glNumber = data;
  }
  close() {
    this.onClose.emit(null);
  }
}
