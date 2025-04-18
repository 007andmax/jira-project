import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyDevicesAssestTypeDropDownComponent } from './company-devices-assest-type-drop-down.component';


@NgModule({
    declarations: [
        CompanyDevicesAssestTypeDropDownComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule
    ],
    exports: [CompanyDevicesAssestTypeDropDownComponent]



})
export class CompanyDevicesAssestTypeDropDownModule { }
