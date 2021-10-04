import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesAsideComponent } from './invoices-aside.component';
import { SelectSearchModule } from 'src/app/components/shared/select-search/select-search.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';


@NgModule({
    declarations: [InvoicesAsideComponent

    ],
    imports: [
        CommonModule,
        SelectSearchModule,
        DatePickerModule,
        NumberModule,
        FormsModule,
        MatFormFieldModule,
        DisabledBtnModule,
        PreloaderTicketModule

    ],
    exports: [InvoicesAsideComponent]


})
export class InvoicesAsideModule { }
