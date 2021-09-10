import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceTicketsComponent } from './invoice-tickets.component';




const routes: Routes = [{ path: '', component: InvoiceTicketsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoiceTicketsRoutingModule { }