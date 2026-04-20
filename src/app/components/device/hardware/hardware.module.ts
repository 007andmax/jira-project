import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HardwareComponent } from './hardware.component';
import { FormsModule } from '@angular/forms';
import { HardwareRoutingModule } from './hardware-routing.module';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HardwareRoutingModule,
        HardwareComponent
    ],
})
export class HardwareModule { }
