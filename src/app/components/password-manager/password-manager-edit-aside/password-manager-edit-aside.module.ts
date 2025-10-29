import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordManagerEditAsideComponent } from './password-manager-edit-aside.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { PasswordManagerEditLinkedComponent } from './password-manager-edit-linked/password-manager-edit-linked.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { AfterViewInitDirective } from 'src/app/directives/after-view-init.directive';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { UploadAreaProgressModule } from '../../shared/upload-area/upload-area-progress/upload-area-progress.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { MatOptionModule } from 'src/app/components/shared/mat-option/mat-option.module';



@NgModule({
    declarations: [PasswordManagerEditAsideComponent,
        PasswordManagerEditLinkedComponent,
        AfterViewInitDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        TextAreaModule,
        DatePickerModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        DynamicTooltipModule,
        UploadAreaProgressModule,
        CompanyDropDownModule,
        ClickOutsideModule,
        MatErrorModule,
        NgbModule,
        MatChipModule,
        MatChipListModule,
        MatOptionModule,
        MatFormFieldModule
    ],
    exports: [PasswordManagerEditAsideComponent]



})
export class PasswordManagerEditAsideModule { }
