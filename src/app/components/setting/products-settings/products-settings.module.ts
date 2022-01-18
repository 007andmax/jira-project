import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsSettingsComponent } from './products-settings.component';
import { ProductsSettingsRoutingModule } from './products-settings-routing.module';
import { AddCategoryProductComponent } from './add-category-product/add-category-product.component';



@NgModule({
    declarations: [
        ProductsSettingsComponent,
        AddCategoryProductComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        ProductsSettingsRoutingModule
    ],



})
export class ProductsSettingsModule { }
