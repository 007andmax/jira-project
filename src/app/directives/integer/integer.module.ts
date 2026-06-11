import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegerDirective } from './integer.directive';



@NgModule({
    declarations: [
        IntegerDirective
    ],
    imports: [
        CommonModule,

    ],
    exports: [IntegerDirective]



})
export class IntegerModule { }
