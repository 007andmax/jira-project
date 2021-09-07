import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecurringTicketsComponent } from './recurring-tickets.component';






const routes: Routes = [{ path: '', component: RecurringTicketsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecurringTicketsRoutingModule { }