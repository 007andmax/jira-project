import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToFixedDirective } from './to-fixed.directive';


@NgModule({
    declarations: [
        ToFixedDirective
    ],
    imports: [
        CommonModule,


    ],
    exports: [ToFixedDirective],


})
export class ToFixedModule { }
