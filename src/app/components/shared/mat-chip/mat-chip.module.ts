import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipComponent } from './mat-chip.component';


@NgModule({
    declarations: [
        MatChipComponent
    ],
    imports: [
        CommonModule,

    ],
    exports: [MatChipComponent],


})
export class MatChipModule { }
