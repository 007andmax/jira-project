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
import { DeviceSettingDeviceTypeComponent } from './device-setting-device-type/device-setting-device-type.component';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { DeviceSettingManufactureComponent } from './device-setting-manufacture/device-setting-manufacture.component';
import { DeviceSettingModelComponent } from './device-setting-model/device-setting-model.component';
import { DeviceSettingManufacturesComponent } from './device-setting-manufactures/device-setting-manufactures.component';
import { DeviceSettingManufacturesAddComponent } from './device-setting-manufactures/device-setting-manufactures-add/device-setting-manufactures-add.component';
import { DeviceSettingModelsComponent } from './device-setting-models/device-setting-models.component';
import { DeviceSettingModelsAddComponent } from './device-setting-models/device-setting-models-add/device-setting-models-add.component';
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';

@NgModule({
    declarations: [
        DeviceSettingComponent,
        ModelPipe,
        AddDeviceTypeComponent,
        AddManufactureComponent,
        AddModelComponent,
        DeviceSettingAsideComponent,
        DeviceSettingDeviceTypeComponent,
        DeviceSettingManufactureComponent,
        DeviceSettingModelComponent,
        DeviceSettingManufacturesComponent,
        DeviceSettingManufacturesAddComponent,
        DeviceSettingModelsComponent,
        DeviceSettingModelsAddComponent
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
        DynamicTooltipModule,
        ClickOtsideModule
    ],
})
export class DeviceSettingModule { }
