import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonContractServicesAddComponent } from './non-contract-services-add.component';
import { FormsModule } from '@angular/forms';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';


@NgModule({
    declarations: [NonContractServicesAddComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        NumberModule,
        TaxesModule,
        DropDownModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        GlNumbersDropDownModule,
        MatErrorModule
    ],
    exports: [NonContractServicesAddComponent]


})
export class NonContractServicesAddModule { }
