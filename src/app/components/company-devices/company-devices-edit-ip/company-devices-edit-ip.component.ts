import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyDevicesEditIpValidate } from './class/company-devices-edit-ip-validate';
import { CompanyDevicesEditLabelComponent } from '../company-devices-edit-label/company-devices-edit-label.component';

@Component({
  selector: 'app-company-devices-edit-ip',
  templateUrl: './company-devices-edit-ip.component.html',
  styleUrls: ['./company-devices-edit-ip.component.scss']
})
export class CompanyDevicesEditIpComponent extends CompanyDevicesEditLabelComponent {

  validate: CompanyDevicesEditIpValidate = new CompanyDevicesEditIpValidate();

  onCheckValue() {
    this.validate.checkIpAddress(this.value);
    console.log("this.value", this.value);
    console.log("this.validate", this.validate);
    if (this.value !== this.field && this.validate.getIpAdress()) this.onChange.emit(this.value);
  }

}
