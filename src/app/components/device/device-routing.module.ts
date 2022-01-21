import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceComponent } from './device.component';

const routes: Routes = [{
    path: '', component: DeviceComponent, children: [
        { path: 'dashboard/:type/:id', loadChildren: './dashboard/dashboard.module#DashboardModule' },
        {
            path: 'hardware/:type/:id',
            loadChildren: './hardware/hardware.module#HardwareModule'

        },
        {
            path: 'software/:type/:id',
            loadChildren: './software/software.module#SoftwareModule'
        },
        {
            path: 'service',
            loadChildren: './services/services.module#ServicesModule'
        },
        {
            path: 'antivirus',
            loadChildren: './antivirus/antivirus.module#AntivirusModule'
        },
        {
            path: 'terminal/:type/:id',
            loadChildren: './terminal/terminal.module#TerminalModule'
        },
        {
            path: 'password',
            loadChildren: './password/password.module#PasswordModule'
        },
        {
            path: 'window',
            loadChildren: './windows-update/windows-update.module#WindowsModule'
        },
        {
            path: 'startup',
            loadChildren: './startup-programes/startup-programes.module#StartupModule'

        },
        {
            path: 'file',
            loadChildren: './file-explorer/file-explorer.module#FileModule'

        }
    ]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceRoutingModule { }