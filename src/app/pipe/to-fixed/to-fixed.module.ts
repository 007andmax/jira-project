import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToFixedPipe } from './to-fixed.pipe';



@NgModule({
    declarations: [
        ToFixedPipe
    ],
    imports: [
        CommonModule,


    ],
    exports: [ToFixedPipe],


})
export class ToFixedModule { }
