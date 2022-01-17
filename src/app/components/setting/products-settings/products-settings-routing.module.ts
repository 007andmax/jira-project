import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsSettingsComponent } from './products-settings.component';

const routes: Routes = [{ path: '', component: ProductsSettingsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsSettingsRoutingModule { }