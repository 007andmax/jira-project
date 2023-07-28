import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOldComponent } from './device-old.component';
import { PermissionNoSuperAdminService } from 'src/app/services/users/permission-no-super-admin.service';


const routes: Routes = [{
    path: '', component: DeviceOldComponent,
    children: [
        {
            path: 'dashboard/:type/:id',
            loadChildren: './dashboard/dashboard.module#DashboardOldModule',
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'hardware/:type/:id',
            loadChildren: './hardware/hardware.module#HardwareOldModule',
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'software/:type/:id',
            loadChildren: './software/software.module#SoftwareOldModule',
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'terminal/:type/:id',
            loadChildren: './terminal/terminal.module#TerminalOldModule',
            canActivate: [PermissionNoSuperAdminService]
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceOldRoutingModule { }