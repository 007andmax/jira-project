import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceSettingComponent } from './device-setting.component';
import { DeviceSettingRoutingModule } from './device-setting-routing.module';

@NgModule({
    declarations: [
        DeviceSettingComponent
    ],
    imports: [
        CommonModule,
        DeviceSettingRoutingModule
    ],
})
export class DeviceSettingModule { }
