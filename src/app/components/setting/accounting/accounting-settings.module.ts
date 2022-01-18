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



@NgModule({
    declarations: [
        AccountingSettingsComponent,
        GlNumberSettingsComponent,
        AccountingYearComponent,
        AddGlNumberComponent,
        InvoiceSettingsComponent,
        QuotesSettingsComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        AccountingSettingsRoutingModule
    ],
})
export class AccoutingSettingsModule { }
