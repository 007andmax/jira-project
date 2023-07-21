import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceComponent } from './device.component';
import { PermissionNoSuperAdminService } from 'src/app/services/users/permission-no-super-admin.service';

const routes: Routes = [{
    path: '', component: DeviceComponent, children: [
        {
            path: 'dashboard/:type/:id',
            loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'hardware/:type/:id',
            loadChildren: () => import('./hardware/hardware.module').then(m => m.HardwareModule),
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'software/:type/:id',
            loadChildren: () => import('./software/software.module').then(m => m.SoftwareModule),
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'service/:type/:id',
            loadChildren: () => import('./services/services.module').then(m => m.ServicesModule),
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'terminal/:type/:id',
            loadChildren: () => import('./terminal/terminal.module').then(m => m.TerminalModule),
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'startup/:type/:id',
            loadChildren: () => import('./startup-programes/startup-programes.module').then(m => m.StartupModule),
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'windows/:type/:id',
            loadChildren: () => import('./window-updates/window-updates.module').then(m => m.WindowUpdatesModule),
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'processes/:type/:id',
            loadChildren: () => import('./processes/processes.module').then(m => m.ProcessesModule),
            canActivate: [PermissionNoSuperAdminService]

        },
    ]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceRoutingModule { }