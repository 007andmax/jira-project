import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { Subscription } from 'rxjs';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { NonContractServices } from '../class/non-contract-service';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { NonContractServiceValidate } from '../class/non-contract-service-validate';
import { NonContractServicesStateService } from 'src/app/states/non-contract-services/non-contract-services-state.service';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { GlNumbersDropDownComponent } from '../../../inventory/gl-numbers-drop-down/gl-numbers-drop-down.component';
import { TaxesComponent } from '../../../shared/taxes/taxes.component';
import { numberDirective } from '../../../../directives/number/number.directive';
import { MatErrorComponent } from '../../../shared/mat-error/mat-error.component';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-non-contract-services-edit',
    templateUrl: './non-contract-services-edit.component.html',
    styleUrls: ['./non-contract-services-edit.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass, FormsModule, MatErrorComponent, numberDirective, TaxesComponent, GlNumbersDropDownComponent]
})
export class NonContractServicesEditComponent implements OnInit, OnDestroy {
  open: boolean = false;
  glNumbers: Array<GlNumber> = [];
  validate: NonContractServiceValidate = new NonContractServiceValidate();
  service: NonContractServices;
  sub: Subscription = new Subscription();
  @ViewChild('glNumberSelect', { static: false }) glNumberSelect: DropDownComponent;
  @Output() onClose = new EventEmitter<any>();
  constructor(private glNumberStateService: GlNumberStateService,
    private glNumberService: GlNumberService,
    private nonContractServicesStateService: NonContractServicesStateService,
    private nonContractServicesService: NonContractServicesService) { }

  ngOnInit() {
    let getShowAsideForEdit = this.nonContractServicesStateService.getShowAsideForEdit().subscribe(data => {
      this.service = data;
      this.open = true;
    })
    this.sub.add(getShowAsideForEdit);
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
    })
    this.sub.add(getOnGlNumbers);

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
    this.service.rate_str = Number(event.target.value).toFixed(2);
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
  glDropDownItemName(item) {
    return `${item["glNumber"]} - ${(item["description"] && item["description"].length > 0) ? item["description"]
      : "No description"}`;
  }
  save() {
    if (!this.validate.isValidate(this.service)) return;
    this.nonContractServicesService.changeService(this.service.getDataForUpdate()).subscribe(data => {
      this.glNumberStateService.refreshGlNumbersCheck();
      this.close();
    })
  }
  onSelectGlNumbers(data) {
    this.service.glNumber = data;
  }
  close() {
    this.open = false;
    this.onClose.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
