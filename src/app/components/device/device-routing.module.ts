import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceComponent } from './device.component';
import { PermissionNoSuperAdminService } from 'src/app/services/users/permission-no-super-admin.service';

const routes: Routes = [{
    path: '', component: DeviceComponent, children: [
        {
            path: 'dashboard/:type/:id',
            loadChildren: './dashboard/dashboard.module#DashboardModule',
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'hardware/:type/:id',
            loadChildren: './hardware/hardware.module#HardwareModule',
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'software/:type/:id',
            loadChildren: './software/software.module#SoftwareModule',
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'service/:type/:id',
            loadChildren: './services/services.module#ServicesModule',
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'terminal/:type/:id',
            loadChildren: './terminal/terminal.module#TerminalModule',
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'startup/:type/:id',
            loadChildren: './startup-programes/startup-programes.module#StartupModule',
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'windows/:type/:id',
            loadChildren: './window-updates/window-updates.module#WindowUpdatesModule',
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'processes/:type/:id',
            loadChildren: './processes/processes.module#ProcessesModule',
            canActivate: [PermissionNoSuperAdminService]

        },
    ]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceRoutingModule { }