import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTooltipComponent } from './dynamic-tooltip.component';


@NgModule({
    declarations: [
        DynamicTooltipComponent
    ],
    imports: [
        CommonModule,


    ],
    exports: [DynamicTooltipComponent],


})
export class DynamicTooltipModule { }
