import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlNumberSettingsComponent } from './gl-number.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GlNumberSettingsRoutingModule } from './gl-number-settings-routing.module';



@NgModule({
    declarations: [GlNumberSettingsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GlNumberSettingsRoutingModule
    ],



})
export class GlNumberSettingsModule { }
