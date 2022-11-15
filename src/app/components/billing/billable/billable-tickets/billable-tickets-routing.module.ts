import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillableTicketsComponent } from './billable-tickets.component';

const routes: Routes = [{ path: '', component: BillableTicketsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillableTicketsRoutingModule { }