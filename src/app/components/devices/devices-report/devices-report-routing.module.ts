import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevicesReportComponent } from './devices-report.component';

const routes: Routes = [{ path: '', component: DevicesReportComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DevicesReportRoutingModule { }