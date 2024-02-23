import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonContractServicesComponent } from './non-contract-services.component';



const routes: Routes = [{ path: '', component: NonContractServicesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NonContractServicesRoutingModule { }