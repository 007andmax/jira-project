
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CompanyDevicesEditLabelComponent } from '../company-devices-edit-label/company-devices-edit-label.component';
import { CompanyDevicesEditMacValidate } from './class/company-devices-edit-mac-validate';
import { MatErrorComponent } from '../../shared/mat-error/mat-error.component';
import { ClickOutsideDirective } from 'src/app/directives/click-otside/click-otside.directive';

@Component({
  standalone: true,
  imports: [MatErrorComponent, FormsModule, CommonModule, ClickOutsideDirective],
  selector: 'app-company-devices-edit-mac',
  templateUrl: './company-devices-edit-mac.component.html',
  styleUrls: ['./company-devices-edit-mac.component.scss'],

})
export class CompanyDevicesEditMacComponent extends CompanyDevicesEditLabelComponent {

  validate: CompanyDevicesEditMacValidate = new CompanyDevicesEditMacValidate();

  onCheckValue() {
    this.validate.checkMacAddress(this.value);
    if (this.value !== this.field && this.validate.getMacAdress()) {
      this.onChange.emit(this.value);
      this.setIsInitEdit(false);
    }
  }

}
