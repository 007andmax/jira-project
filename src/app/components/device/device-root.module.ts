import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceComponent } from './device.component';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';

import { DeviceRoutingModule } from './device-routing.module';

@NgModule({
    imports: [
    CommonModule,
    RouterModule,
    DeviceRoutingModule,
    DeviceComponent,
    NavComponent,
],
})
export class DeviceModule { }
