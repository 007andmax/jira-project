import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechUsersComponent } from './tech-users.component';


const routes: Routes = [{ path: '', component: TechUsersComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TechUsersRoutingModule { }