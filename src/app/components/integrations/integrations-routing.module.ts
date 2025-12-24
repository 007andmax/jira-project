import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntegrationsComponent } from './integrations.component';


const routes: Routes = [{
    path: '', component: IntegrationsComponent, children: [
        {
            path: 'all-integrations',
            loadChildren: () => import('./all-integrations/all-integrations.module').then(m => m.AllIntegrationsModule),

        },]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IntegrationsRoutingModule { }