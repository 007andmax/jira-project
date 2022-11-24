import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceSettingComponent } from './device-setting.component';
import { DeviceSettingRoutingModule } from './device-setting-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatFormFieldModule, MatIconModule, MatSelectModule } from '@angular/material';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModelPipe } from 'src/app/pipe/model.pipe';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';

@NgModule({
    declarations: [
        DeviceSettingComponent,
        ModelPipe
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
