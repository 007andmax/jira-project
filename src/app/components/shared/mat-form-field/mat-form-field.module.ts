import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldComponent } from './mat-form-field.component';


@NgModule({
    declarations: [
        MatFormFieldComponent
    ],
    imports: [
        CommonModule,


    ],
    exports: [MatFormFieldComponent],


})
export class MatFormFieldModule { }
