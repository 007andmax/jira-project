import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideUserDeviceServiceComponent } from './contracts-aside-user-device-service.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';



@NgModule({
    declarations: [ContractsAsideUserDeviceServiceComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        TaxesModule,
        NumberModule,
        InvoiceFormTicketEditTaxesModule,
        DecimalNumberModule,
        MatErrorModule
    ],
    exports: [ContractsAsideUserDeviceServiceComponent]
})
export class ContractsAsideUserDeviceServiceModule { }
