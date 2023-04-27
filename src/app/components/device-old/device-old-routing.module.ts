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
            path: 'terminal/:type/:id',
            loadChildren: './terminal/terminal.module#TerminalOldModule',
            canActivate: [PermissionTechUserService]
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceOldRoutingModule { }