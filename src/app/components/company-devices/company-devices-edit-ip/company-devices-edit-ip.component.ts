import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyDevicesEditIpValidate } from './class/company-devices-edit-ip-validate';
import { CompanyDevicesEditLabelComponent } from '../company-devices-edit-label/company-devices-edit-label.component';
import { MatErrorComponent } from '../../shared/mat-error/mat-error.component';

@Component({
  standalone: true,
  imports: [MatErrorComponent, FormsModule, CommonModule],
  selector: 'app-company-devices-edit-ip',
  templateUrl: './company-devices-edit-ip.component.html',
  styleUrls: ['./company-devices-edit-ip.component.scss'],
  standalone: true
})
export class CompanyDevicesEditIpComponent extends CompanyDevicesEditLabelComponent {

  validate: CompanyDevicesEditIpValidate = new CompanyDevicesEditIpValidate();

  onCheckValue() {
    this.validate.checkIpAddress(this.value);
    if (this.value !== this.field && this.validate.getIpAdress()) {
      this.onChange.emit(this.value);
      this.setIsInitEdit(false);
    }
  }

}
