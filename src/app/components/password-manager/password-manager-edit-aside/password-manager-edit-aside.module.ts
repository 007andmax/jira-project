import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordManagerEditAsideComponent } from './password-manager-edit-aside.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { PasswordManagerEditLinkedComponent } from './password-manager-edit-linked/password-manager-edit-linked.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';


@NgModule({
    declarations: [PasswordManagerEditAsideComponent,
        PasswordManagerEditLinkedComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        DropDownModule,
        TextAreaModule,
        DatePickerModule,
        DisabledBtnModule,
        PreloaderTicketModule
    ],
    exports: [PasswordManagerEditAsideComponent]



})
export class PasswordManagerEditAsideModule { }
