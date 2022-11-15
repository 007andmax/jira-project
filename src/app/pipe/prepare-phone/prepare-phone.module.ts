import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreparePhonePipe } from './prepare-phone.pipe';



@NgModule({
    declarations: [
        PreparePhonePipe
    ],
    imports: [
        CommonModule,


    ],
    exports: [PreparePhonePipe],


})
export class PreparePhoneModule { }
