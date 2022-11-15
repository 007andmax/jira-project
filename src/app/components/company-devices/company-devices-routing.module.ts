import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyDevicesComponent } from './company-devices.component';





const routes: Routes = [{ path: '', component: CompanyDevicesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyDevicesRoutingModule { }