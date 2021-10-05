import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceComponent } from './device.component';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { DateFormatModule } from 'src/app/pipe/dateFormat/date-format.module';


@NgModule({
    declarations: [DeviceComponent,
        NavComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        DateFormatModule
    ],
    exports: [DeviceComponent]


})
export class DeviceModule { }
