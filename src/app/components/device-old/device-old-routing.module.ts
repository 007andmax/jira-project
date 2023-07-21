import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOldComponent } from './device-old.component';
import { PermissionNoSuperAdminService } from 'src/app/services/users/permission-no-super-admin.service';


const routes: Routes = [{
    path: '', component: DeviceOldComponent,
    children: [
        {
            path: 'dashboard/:type/:id',
            loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardOldModule),
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'hardware/:type/:id',
            loadChildren: () => import('./hardware/hardware.module').then(m => m.HardwareOldModule),
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'software/:type/:id',
            loadChildren: () => import('./software/software.module').then(m => m.SoftwareOldModule),
            canActivate: [PermissionNoSuperAdminService]
        },
        {
            path: 'terminal/:type/:id',
            loadChildren: () => import('./terminal/terminal.module').then(m => m.TerminalOldModule),
            canActivate: [PermissionNoSuperAdminService]
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceOldRoutingModule { }