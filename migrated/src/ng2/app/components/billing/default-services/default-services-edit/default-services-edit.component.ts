import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';
import { Subscription } from 'rxjs';
import { SelectSearchComponent } from '../../../shared/select-search/select-search.component';
import { GlNumberStateService } from 'src/ng2/app/states/gl-number/gl-number-state.service';
import { DefaultServices } from '../class/default-service';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { TaxesComponent } from '../../../shared/taxes/taxes.component';
import { GlNumberService } from 'src/ng2/app/services/gl-number/gl-number.service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { DefaultServiceValidate } from '../class/default-service-validate';

@Component({
  selector: 'app-default-services-edit',
  templateUrl: './default-services-edit.component.html',
  styleUrls: ['./default-services-edit.component.scss']
})
export class DefaultServicesEditComponent implements OnInit {
  glNumbers: Array<GlNumber> = [];
  validate: DefaultServiceValidate = new DefaultServiceValidate();
  @Input() service: DefaultServices;
  sub: Subscription = new Subscription();
  @ViewChild('glNumberSelect') glNumberSelect: SelectSearchComponent;
  @ViewChild('taxSelect') taxSelect: TaxesComponent;
  @Output() onClose = new EventEmitter<any>();
  constructor(private glNumberStateService: GlNumberStateService,
    private glNumberService: GlNumberService,
    private defaultServicesService: DefaultServicesService,
    private taxesStateService: TaxesStateService) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
    })
    this.sub.add(getOnGlNumbers);
    console.log("service", this.service);
    this.taxSelect.setEditItem(this.service.taxes);
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
    console.log("this.service.rate",this.service.rate);
    if (this.service.rate >= 0) this.validate.resetRate();
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
    this.defaultServicesService.changeService(this.service.getDataForUpdate()).subscribe(data => {
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
