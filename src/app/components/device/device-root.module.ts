import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceComponent } from './device.component';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { DateFormatModule } from 'src/app/pipe/dateFormat/date-format.module';
import { DeviceRoutingModule } from './device-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxUploaderModule } from 'ngx-uploader';

import { AntivirusComponent } from './antivirus/antivirus.component';
import { FileComponent } from './file-explorer/file-explorer.component';
import { HardwareComponent } from './hardware/hardware.component';
import { PasswordComponent } from './password/password.component';
import { ProcessesComponent } from './processes/processes.component';
import { ServicesComponent } from './services/services.component';
import { SoftwareComponent } from './software/software.component';
import { StartupComponent } from './startup-programes/startup-programes.component';
import { TerminalComponent } from './terminal/terminal.component';
import { WindowUpdatesComponent } from './window-updates/window-updates.component';
import { WindowsComponent } from './windows-update/windows-update.component';


@NgModule({
    declarations: [DeviceComponent,
        NavComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        DateFormatModule,
        DeviceRoutingModule,

        // DashboardModule
    ],

})
export class DeviceModule { }
