import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlNumberSettingsComponent } from './gl-number.component';




const routes: Routes = [{ path: '', component: GlNumberSettingsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GlNumberSettingsRoutingModule { }