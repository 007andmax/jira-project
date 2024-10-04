import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyDevicesCustomAsideComponent } from './company-devices-custom-aside.component';
import { CompanyDevicesCustomDropDownComponent } from './company-devices-custom-drop-down/company-devices-custom-drop-down.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { ManufacturesDropDownComponent } from './manufactures-drop-down/manufactures-drop-down.component';
import { ModelsDropDownComponent } from './models-drop-down/models-drop-down.component';
import { CompanyDevicesAssestTypeDropDownComponent } from './company-devices-assest-type-drop-down/company-devices-assest-type-drop-down.component';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';


@NgModule({
    declarations: [
        CompanyDevicesCustomAsideComponent,
        CompanyDevicesCustomDropDownComponent,
        ManufacturesDropDownComponent,
        ModelsDropDownComponent,
        CompanyDevicesAssestTypeDropDownComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        PreloaderTicketModule,
        DisabledBtnModule,
        DatePickerModule,
        NgbModule,
        DynamicTooltipModule
    ],
    exports: [CompanyDevicesCustomAsideComponent]



})
export class CompanyDevicesCustomAsideModule { }
