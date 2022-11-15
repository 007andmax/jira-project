import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartupComponent } from './startup-programes.component';


const routes: Routes = [{ path: '', component: StartupComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StartupRoutingModule { }