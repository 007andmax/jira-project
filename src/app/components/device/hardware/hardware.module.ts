import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HardwareComponent } from './hardware.component';
import { FormsModule } from '@angular/forms';
import { HardwareRoutingModule } from './hardware-routing.module';



@NgModule({
    declarations: [HardwareComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HardwareRoutingModule
    ],



})
export class HardwareModule { }
