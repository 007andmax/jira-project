import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountingSettingsComponent } from './accounting-settings.component';
import { AccountingSettingsRoutingModule } from './accounting-settings-routing.module';
import { GlNumberSettingsComponent } from './gl-number/gl-number.component';
import { AccountingYearComponent } from './accounting-year/accounting-year.component';
import { AddGlNumberComponent } from './gl-number/add-gl-number/add-gl-number.component';
import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';
import { QuotesSettingsComponent } from './quotes-settings/quotes-settings.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';


import { TaxesSettingsComponent } from './taxes/taxes.component';
import { TaxesAddComponent } from './taxes/taxes-add/taxes-add.component';


import { CustomNotesSettingsComponent } from './custom-notes-settings/custom-notes-settings.component';
import { AddCustomNotesSettingsComponent } from './custom-notes-settings/add-custom-notes-settings/add-custom-notes-settings.component';
import { EditCustomNotesSettingsComponent } from './custom-notes-settings/edit-custom-notes-settings/edit-custom-notes-settings.component';




@NgModule({
    declarations: [
        AccountingSettingsComponent,
        GlNumberSettingsComponent,
        AccountingYearComponent,
        AddGlNumberComponent,
        InvoiceSettingsComponent,
        QuotesSettingsComponent,
        TaxesSettingsComponent,
        TaxesAddComponent,
        CustomNotesSettingsComponent,
        AddCustomNotesSettingsComponent,
        EditCustomNotesSettingsComponent,
    ],
    imports: [
    CommonModule,
    NgbModule,
    AccountingSettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
],
})
export class AccoutingSettingsModule { }
