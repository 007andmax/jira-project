import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule, MatIconModule, MatSelectModule } from '@angular/material';
import { ContractsAsideUserDeviceServiceComponent } from './contracts-aside-user-device-service.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { NumberModule } from 'src/app/directives/number/number.module';



@NgModule({
    declarations: [ContractsAsideUserDeviceServiceComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        FormsModule,
        NgbModule,
        InvoiceFormTicketEditTaxesModule,
        NumberModule
    ],
    exports: [ContractsAsideUserDeviceServiceComponent]


})
export class ContractsAsideUserDeviceServiceModule { }
