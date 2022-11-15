import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillableComponent } from './billable.component';


const routes: Routes = [{ path: '', component: BillableComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillableRoutingModule { }