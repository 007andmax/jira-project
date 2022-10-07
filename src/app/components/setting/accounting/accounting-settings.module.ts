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
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { TaxesSettingsComponent } from './taxes/taxes.component';



@NgModule({
    declarations: [
        AccountingSettingsComponent,
        GlNumberSettingsComponent,
        AccountingYearComponent,
        AddGlNumberComponent,
        InvoiceSettingsComponent,
        QuotesSettingsComponent,
        TaxesSettingsComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        AccountingSettingsRoutingModule,
        ClickOtsideModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        DropDownModule,
        TextAreaModule
    ],
})
export class AccoutingSettingsModule { }
