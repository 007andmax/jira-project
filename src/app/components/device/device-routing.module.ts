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
            path: 'service/:type/:id',
            loadChildren: './services/services.module#ServicesModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'terminal/:type/:id',
            loadChildren: './terminal/terminal.module#TerminalModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'startup/:type/:id',
            loadChildren: './startup-programes/startup-programes.module#StartupModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'windows/:type/:id',
            loadChildren: './window-updates/window-updates.module#WindowUpdatesModule',
            canActivate: [PermissionTechUserService]
        },
        {
            path: 'processes/:type/:id',
            loadChildren: './processes/processes.module#ProcessesModule',

        },
    ]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceRoutingModule { }