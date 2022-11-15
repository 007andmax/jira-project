import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionTechUserService } from 'src/app/services/users/permission-tech-user.service';
import { DeviceComponent } from './device.component';

const routes: Routes = [{
    path: '', component: DeviceComponent, children: [
        {
            path: 'dashboard/:type/:id',
            loadChildren: './dashboard/dashboard.module#DashboardModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'hardware/:type/:id',
            loadChildren: './hardware/hardware.module#HardwareModule',
            canActivate: [PermissionTechUserService]

        },
        {
            path: 'software/:type/:id',
            loadChildren: './software/software.module#SoftwareModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'service',
            loadChildren: './services/services.module#ServicesModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'antivirus',
            loadChildren: './antivirus/antivirus.module#AntivirusModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'terminal/:type/:id',
            loadChildren: './terminal/terminal.module#TerminalModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'password',
            loadChildren: './password/password.module#PasswordModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'window',
            loadChildren: './windows-update/windows-update.module#WindowsModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'startup',
            loadChildren: './startup-programes/startup-programes.module#StartupModule',
            canActivate: [PermissionTechUserService]

        },
        {
            path: 'file',
            loadChildren: './file-explorer/file-explorer.module#FileModule',
            canActivate: [PermissionTechUserService]

        }
    ]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceRoutingModule { }