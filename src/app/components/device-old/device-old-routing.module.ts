import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionTechUserService } from 'src/app/services/users/permission-tech-user.service';
import { DeviceOldComponent } from './device-old.component';


const routes: Routes = [{
    path: '', component: DeviceOldComponent,
    children: [
        {
            path: 'dashboard/:type/:id',
            loadChildren: './dashboard/dashboard.module#DashboardOldModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'hardware/:type/:id',
            loadChildren: './hardware/hardware.module#HardwareOldModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'software/:type/:id',
            loadChildren: './software/software.module#SoftwareOldModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'service',
            loadChildren: './services/services.module#ServicesOldModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'antivirus',
            loadChildren: './antivirus/antivirus.module#AntivirusOldModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'terminal/:type/:id',
            loadChildren: './terminal/terminal.module#TerminalOldModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'password',
            loadChildren: './password/password.module#PasswordOldModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'window',
            loadChildren: './windows-update/windows-update.module#WindowsOldModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'startup',
            loadChildren: './startup-programes/startup-programes.module#StartupOldModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'file',
            loadChildren: './file-explorer/file-explorer.module#FileOldModule',
            canActivate: [PermissionTechUserService]
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceOldRoutingModule { }