import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscriptionServicesComponent } from './subscription-services.component';

const routes: Routes = [{ path: '', component: SubscriptionServicesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubscriptionServicesRoutingModule { }