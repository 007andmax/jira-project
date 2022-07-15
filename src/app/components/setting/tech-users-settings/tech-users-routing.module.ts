import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechUsersSettingsComponent } from './tech-users-settings.component';



const routes: Routes = [{ path: '', component: TechUsersSettingsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TechUsersSettingsRoutingModule { }