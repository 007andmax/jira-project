import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultServicesAddComponent } from './default-services-add.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';


@NgModule({
    declarations: [DefaultServicesAddComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        NumberModule,
        TaxesModule,
        DropDownModule,
        DisabledBtnModule,
        PreloaderTicketModule
    ],
    exports: [DefaultServicesAddComponent]


})
export class DefaultServicesAddModule { }
