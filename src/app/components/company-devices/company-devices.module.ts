import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDevicesComponent } from './company-devices.component';
import { CompanyDevicesHeaderComponent } from './company-devices-header/company-devices-header.component';
import { FormsModule } from '@angular/forms';
import { CompanyDevicesItemComponent } from './company-devices-item/company-devices-item.component';
import { CompanyDevicesAsideComponent } from './company-devices-aside/company-devices-aside.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyDevicesNoExistRemoteSessionsComponent } from './company-devices-item/company-devices-no-exist-remote-sessions/company-devices-no-exist-remote-sessions.component';
import { CompanyDevicesExistRemoteSessionsComponent } from './company-devices-item/company-devices-exist-remote-sessions/company-devices-exist-remote-sessions.component';
import { CompanyDevicesAsideDeviceIconComponent } from './company-devices-aside/company-devices-aside-device-icon/company-devices-aside-device-icon.component';
import { CompanyDevicesAsideSystemComponent } from './company-devices-aside/company-devices-aside-system/company-devices-aside-system.component';
import { CompanyDevicesAsideNetworkTabComponent } from './company-devices-aside/company-devices-aside-network-tab/company-devices-aside-network-tab.component';
import { CompanyDevicesAsideSoftwareComponent } from './company-devices-aside/company-devices-aside-software/company-devices-aside-software.component';
import { CompanyDevicesAsideUpdatesComponent } from './company-devices-aside/company-devices-aside-updates/company-devices-aside-updates.component';
import { CompanyDevicesEditLabelModule } from './company-devices-edit-label/company-devices-edit-label.module';
import { DatePickerModule } from '../shared/date-picker/date-picker.module';
import { CompanyDevicesRoutingModule } from './company-devices-routing.module';


@NgModule({
    declarations: [
        CompanyDevicesComponent,
        CompanyDevicesHeaderComponent,
        CompanyDevicesItemComponent,
        CompanyDevicesAsideComponent,
        CompanyDevicesNoExistRemoteSessionsComponent,
        CompanyDevicesExistRemoteSessionsComponent,
        CompanyDevicesAsideDeviceIconComponent,
        CompanyDevicesAsideSystemComponent,
        CompanyDevicesAsideNetworkTabComponent,
        CompanyDevicesAsideSoftwareComponent,
        CompanyDevicesAsideUpdatesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        CompanyDevicesEditLabelModule,
        DatePickerModule,
        CompanyDevicesRoutingModule
    ],



})
export class CompanyDevicesModule { }
