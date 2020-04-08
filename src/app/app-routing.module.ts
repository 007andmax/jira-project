import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HardwareComponent } from './hardware/hardware.component';
import { SoftwareComponent } from './software/software.component';
import { StartupProgramesComponent } from './startup-programes/startup-programes.component';
import { ServicesComponent } from './services/services.component';
import { AntivirusComponent } from './antivirus/antivirus.component';
import { TerminalComponent } from './terminal/terminal.component';
import { WindowsUpdateComponent } from './windows-update/windows-update.component';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { PasswordComponent } from './password/password.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'device/dashboard', component: DashboardComponent },
  { path: 'device/hardware', component: HardwareComponent },
  { path: 'device/software', component: SoftwareComponent },
  { path: 'device/startup-programes', component: StartupProgramesComponent },
  { path: 'device/services', component: ServicesComponent },
  { path: 'device/antivirus', component: AntivirusComponent },
  { path: 'device/terminal', component: TerminalComponent },
  { path: 'device/windows-update', component: WindowsUpdateComponent },
  { path: 'device/file-explorer', component: FileExplorerComponent },
  { path: 'device/password', component: PasswordComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
