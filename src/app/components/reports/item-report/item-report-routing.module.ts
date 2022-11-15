import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemReportComponent } from './item-report.component';





const routes: Routes = [{ path: '', component: ItemReportComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemReportRoutingModule { }