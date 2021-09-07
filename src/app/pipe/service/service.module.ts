import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicePipe } from './service.pipe';



@NgModule({
    declarations: [
        ServicePipe
    ],
    imports: [
        CommonModule,


    ],
    exports: [ServicePipe],


})
export class ServiceModule { }
