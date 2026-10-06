import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyDevicesEditIpValidate } from './class/company-devices-edit-ip-validate';
import { CompanyDevicesEditLabelComponent } from '../company-devices-edit-label/company-devices-edit-label.component';
import { MatErrorComponent } from '../../shared/mat-error/mat-error.component';
import { ClickOutsideDirective } from 'src/app/directives/click-otside/click-otside.directive';

@Component({
  standalone: true,
  imports: [MatErrorComponent, FormsModule, CommonModule, ClickOutsideDirective],
  selector: 'app-company-devices-edit-ip',
  templateUrl: './company-devices-edit-ip.component.html',
  styleUrls: ['./company-devices-edit-ip.component.scss'],

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
