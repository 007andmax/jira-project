import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketsDashboardComponent } from './tickets-dashboard.component';



const routes: Routes = [{ path: '', component: TicketsDashboardComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketsDashboardRoutingModule { }