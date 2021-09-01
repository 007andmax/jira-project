import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyProductsComponent } from './company-products.component';




const routes: Routes = [{ path: '', component: CompanyProductsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyProductsRoutingModule { }