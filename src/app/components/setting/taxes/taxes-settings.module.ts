import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxesSettingsComponent } from './taxes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaxesSettingsRoutingModule } from './taxes-settings-routing.module';


@NgModule({
    declarations: [TaxesSettingsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TaxesSettingsRoutingModule
    ],



})
export class TaxesSettingsModule { }
