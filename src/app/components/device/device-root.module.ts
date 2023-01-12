import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceComponent } from './device.component';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { DateFormatModule } from 'src/app/pipe/dateFormat/date-format.module';
import { DeviceRoutingModule } from './device-routing.module';

@NgModule({
    declarations: [DeviceComponent,
        NavComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        DateFormatModule,
        DeviceRoutingModule,
    ],

})
export class DeviceModule { }
