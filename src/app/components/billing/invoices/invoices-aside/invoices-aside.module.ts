import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesAsideComponent } from './invoices-aside.component';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';


@NgModule({
    declarations: [InvoicesAsideComponent

    ],
    imports: [
        CommonModule,
        DatePickerModule,
        NumberModule,
        FormsModule,
        MatFormFieldModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        CompanyDropDownModule,
        DropDownModule,
        MatErrorModule
    ],
    exports: [InvoicesAsideComponent]


})
export class InvoicesAsideModule { }
