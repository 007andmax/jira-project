import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipTagComponent } from './mat-chip-tag.component';
import { DynamicTooltipModule } from '../dynamic-tooltip/dynamic-tooltip.module';


@NgModule({
    declarations: [
        MatChipTagComponent
    ],
    imports: [
        CommonModule,
        DynamicTooltipModule
    ],
    exports: [MatChipTagComponent],


})
export class MatChipTagModule { }
