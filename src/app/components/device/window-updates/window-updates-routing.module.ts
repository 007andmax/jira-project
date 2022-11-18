import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WindowUpdatesComponent } from './window-updates.component';


const routes: Routes = [{ path: '', component: WindowUpdatesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WindowUpdatesRoutingModule { }