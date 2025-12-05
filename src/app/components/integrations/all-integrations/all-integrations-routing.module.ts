import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllIntegrationsComponent } from './all-integrations.component';


const routes: Routes = [{
    path: '', component: AllIntegrationsComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AllIntegrationsRoutingModule { }