import { Component, OnInit } from '@angular/core';
import { CompanyDevicesEditLabelComponent } from '../company-devices-edit-label/company-devices-edit-label.component';
import { CompanyDevicesEditMacValidate } from './class/company-devices-edit-mac-validate';

@Component({
  selector: 'app-company-devices-edit-mac',
  templateUrl: './company-devices-edit-mac.component.html',
  styleUrls: ['./company-devices-edit-mac.component.scss']
})
export class CompanyDevicesEditMacComponent extends CompanyDevicesEditLabelComponent {

  validate: CompanyDevicesEditMacValidate = new CompanyDevicesEditMacValidate();

  onCheckValue() {
    this.validate.checkMacAddress(this.value);
    console.log("this.value", this.value);
    console.log("this.validate", this.validate);
    if (this.value !== this.field && this.validate.getMacAdress()) this.onChange.emit(this.value);
  }

}
