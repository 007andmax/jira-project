import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOldComponent } from './device-old.component';
import { DeviceOldRoutingModule } from './device-old-routing.module';
import { NavOldComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { TicketTaskComponent } from './ticket-task/ticket-task.component';


@NgModule({
    imports: [
    CommonModule,
    RouterModule,
    DeviceOldRoutingModule,
    DeviceOldComponent,
    NavOldComponent
],
})
export class DevicesOldModule { }
