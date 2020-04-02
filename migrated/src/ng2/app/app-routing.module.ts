import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/device/dashboard/dashboard.component';
import { HardwareComponent } from './components/device/hardware/hardware.component';
import { SoftwareComponent } from './components/device/software/software.component';
import { StartupProgramesComponent } from './components/device/startup-programes/startup-programes.component';
import { ServicesComponent } from './components/device/services/services.component';
import { AntivirusComponent } from './components/device/antivirus/antivirus.component';
import { TerminalComponent } from './components/device/terminal/terminal.component';
import { WindowsUpdateComponent } from './components/device/windows-update/windows-update.component';
import { FileExplorerComponent } from './components/device/file-explorer/file-explorer.component';
import { PasswordComponent } from './components/device/password/password.component';



const routes: Routes = [
];

/**
 * Route for main module
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
