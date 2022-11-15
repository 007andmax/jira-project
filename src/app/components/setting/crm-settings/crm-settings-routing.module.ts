import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrmSettingsComponent } from './crm-settings.component';


const routes: Routes = [{ path: '', component: CrmSettingsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CrmSettingsRoutingModule { }