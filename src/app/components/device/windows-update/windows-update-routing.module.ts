import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WindowsComponent } from './windows-update.component';




const routes: Routes = [{ path: '', component: WindowsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WindowsRoutingModule { }