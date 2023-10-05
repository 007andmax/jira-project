import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractsStatisticsComponent } from './contracts-statistics.component';


const routes: Routes = [{ path: '', component: ContractsStatisticsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContractsStatisticsRoutingModule { }