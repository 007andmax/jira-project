import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOldComponent } from './device-old.component';
import { DeviceOldRoutingModule } from './device-old-routing.module';
import { NavOldComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        DeviceOldComponent,
        NavOldComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        DeviceOldRoutingModule
    ],
})
export class DevicesOldModule { }
