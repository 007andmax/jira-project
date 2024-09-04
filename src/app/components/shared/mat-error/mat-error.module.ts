import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatErrorComponent } from './mat-error.component';


@NgModule({
    declarations: [
        MatErrorComponent
    ],
    imports: [
        CommonModule,

    ],
    exports: [MatErrorComponent],


})
export class MatErrorModule { }
