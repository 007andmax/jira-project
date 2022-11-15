import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalNumberDirective } from './decimal-number.directive';



@NgModule({
    declarations: [DecimalNumberDirective
    ],
    imports: [
        CommonModule,

    ],
    exports: [DecimalNumberDirective]


})
export class DecimalNumberModule { }
