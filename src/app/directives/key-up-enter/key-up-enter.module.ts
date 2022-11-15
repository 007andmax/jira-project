import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyUpEnterDirective } from './key-up-enter.directive';



@NgModule({
    declarations: [KeyUpEnterDirective
    ],
    imports: [
        CommonModule,

    ],
    exports: [KeyUpEnterDirective]


})
export class KeyUpEnterModule { }
