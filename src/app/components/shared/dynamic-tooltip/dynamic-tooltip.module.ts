import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTooltipComponent } from './dynamic-tooltip.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        DynamicTooltipComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [DynamicTooltipComponent],
})
export class DynamicTooltipModule { }
