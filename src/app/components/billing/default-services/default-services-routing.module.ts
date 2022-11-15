import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultServicesComponent } from './default-services.component';



const routes: Routes = [{ path: '', component: DefaultServicesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DefaultServicesRoutingModule { }