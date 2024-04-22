import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TaxesComponent } from 'src/app/components/shared/taxes/taxes.component';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { ContractsUserDeviceService } from '../../class/contracts-user-device-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contracts-aside-user-device-service',
  templateUrl: './contracts-aside-user-device-service.component.html',
  styleUrls: ['./contracts-aside-user-device-service.component.scss']
})
export class ContractsAsideUserDeviceServiceComponent implements OnInit, OnDestroy {
  @Input() service: ContractsUserDeviceService;
  @Output() onRemove = new EventEmitter<any>();
  @Output() onCheckName = new EventEmitter<any>();
  @ViewChild('taxesDropDown') taxesDropDown: TaxesComponent;
  sub: Subscription = new Subscription();
  constructor(private taxesStateService: TaxesStateService,) { }

  ngOnInit() {
    if (this.taxesStateService.getTaxes().length > 0) this.getTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.getTaxes(data);
    })
    this.sub.add(getOnTaxess);
  }
  getTaxes(taxes) {
    let listTaxes = [];
    this.service.taxIds.forEach(id => {
      let find = taxes.find(tax => tax.id === id);
      if (find) listTaxes.push(find);

    });
    this.taxesDropDown.setEditItems(listTaxes);
  }
  onChangeCount(event) {
    this.service.count = event;
  }
  remove() {
    this.onRemove.emit(null);
  }
  onTaxesChange(data) {
    this.service.taxIds = data.map(item => item.id);
  }
  checkName() {
    this.onCheckName.emit(null);
  }
  onChange() {
    this.service.setValidate(true);
    this.service.setValidateDuplicated(true);
  }
  public onChangeRate(val) {
    let value = Number(val);
    this.service.rate = value;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
