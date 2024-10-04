import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipListComponent } from './mat-chip-list.component';


@NgModule({
    declarations: [
        MatChipListComponent
    ],
    imports: [
        CommonModule,

    ],
    exports: [MatChipListComponent],


})
export class MatChipListModule { }
