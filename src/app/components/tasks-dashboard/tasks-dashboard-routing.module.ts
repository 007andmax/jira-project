import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksDashboardComponent } from './tasks-dashboard.component';

const routes: Routes = [{ path: '', component: TasksDashboardComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TasksDashboardRoutingModule { }