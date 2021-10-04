import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyPipe } from './company.pipe';


@NgModule({
    declarations: [
        CompanyPipe
    ],
    imports: [
        CommonModule,


    ],
    exports: [CompanyPipe],


})
export class CompanyPipeModule { }
