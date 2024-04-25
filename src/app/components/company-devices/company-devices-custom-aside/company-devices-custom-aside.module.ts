import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyDevicesCustomAsideComponent } from './company-devices-custom-aside.component';
import { CompanyDevicesCustomDropDownComponent } from './company-devices-custom-drop-down/company-devices-custom-drop-down.component';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { ManufacturesDropDownComponent } from './manufactures-drop-down/manufactures-drop-down.component';
import { ModelsDropDownComponent } from './models-drop-down/models-drop-down.component';


@NgModule({
    declarations: [
        CompanyDevicesCustomAsideComponent,
        CompanyDevicesCustomDropDownComponent,
        ManufacturesDropDownComponent,
        ModelsDropDownComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        PreloaderTicketModule,
        DisabledBtnModule,
        DatePickerModule,
        NgbModule,
        DynamicTooltipModule
    ],
    exports: [CompanyDevicesCustomAsideComponent]



})
export class CompanyDevicesCustomAsideModule { }
