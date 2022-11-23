import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceSettingComponent } from './device-setting.component';
import { DeviceSettingRoutingModule } from './device-setting-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatFormFieldModule, MatIconModule, MatSelectModule } from '@angular/material';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModelPipe } from 'src/app/pipe/model.pipe';
import { AddDeviceTypeComponent } from './add-device-type/add-device-type.component';
import { AddManufactureComponent } from './add-manufacture/add-manufacture.component';
import { AddModelComponent } from './add-model/add-model.component';
import { DeviceSettingAsideComponent } from './device-setting-aside/device-setting-aside.component';

@NgModule({
    declarations: [
        DeviceSettingComponent,
        ModelPipe,
        AddDeviceTypeComponent,
        AddManufactureComponent,
        AddModelComponent,
        DeviceSettingAsideComponent
    ],
    imports: [
        CommonModule,
        DeviceSettingRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        DropDownModule,
        MatFormFieldModule,
        NgbModule,
    ],
})
export class DeviceSettingModule { }
