import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionTechUserService } from 'src/app/services/users/permission-tech-user.service';
import { AntivirusComponent } from './antivirus/antivirus.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeviceComponent } from './device.component';
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

const routes: Routes = [{
    path: '', component: DeviceComponent, children: [
        {
            path: 'dashboard/:type/:id',
            component: DashboardComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'hardware/:type/:id',
            component: HardwareComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'software/:type/:id',
            component: SoftwareComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'service/:type/:id',
            component: ServicesComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'antivirus/:type/:id',
            component: AntivirusComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'terminal/:type/:id',
            component: TerminalComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'password/:type/:id',
            component: PasswordComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'window/:type/:id',
            component: WindowsComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'startup/:type/:id',
            component: StartupComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'file/:type/:id',
            component: FileComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'windows/:type/:id',
            component: WindowUpdatesComponent,
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'processes/:type/:id',
            component: ProcessesComponent
        },
    ]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceRoutingModule { }