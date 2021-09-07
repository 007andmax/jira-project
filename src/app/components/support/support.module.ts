import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';
import { SupportItemComponent } from './support-item/support-item.component';
import { DynamicTooltipModule } from '../shared/dynamic-tooltip/dynamic-tooltip.module';
import { SupportRoutingModule } from './support-routing.module';



@NgModule({
    declarations: [SupportComponent,
        SupportItemComponent
    ],
    imports: [
        CommonModule,
        DynamicTooltipModule,
        SupportRoutingModule

    ],



})
export class SupportModule { }
