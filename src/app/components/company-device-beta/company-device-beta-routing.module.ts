import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyDeviceBetaComponent } from './company-device-beta.component';

const routes: Routes = [{ path: '', component: CompanyDeviceBetaComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyDeviceBetaRoutingModule { }