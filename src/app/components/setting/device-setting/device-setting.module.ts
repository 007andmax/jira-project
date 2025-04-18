import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceSettingComponent } from './device-setting.component';
import { DeviceSettingRoutingModule } from './device-setting-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { ManufacturesCheckUseComponent } from './manufactures-check-use/manufactures-check-use.component';
import { DeviceSettingTypeComponent } from './device-setting-type/device-setting-type.component';
import { AddDeviceSettingTypeComponent } from './device-setting-type/add-device-setting-type/add-device-setting-type.component';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { DeviceSettingTypeCheckUseComponent } from './device-setting-type/device-setting-type-check-use/device-setting-type-check-use.component';

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
        DeviceSettingModelsAddComponent,
        DeviceSettingTypeComponent,
        AddDeviceSettingTypeComponent
    ],
    imports: [
        CommonModule,
        DeviceSettingRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        DropDownModule,
        NgbModule,
        DynamicTooltipModule,
        ClickOutsideModule,
        KeyUpEnterModule,
        MatErrorModule
    ],
})
export class DeviceSettingModule { }
