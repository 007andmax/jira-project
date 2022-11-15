import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceSettingComponent } from './device-setting.component';


const routes: Routes = [{ path: '', component: DeviceSettingComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceSettingRoutingModule { }