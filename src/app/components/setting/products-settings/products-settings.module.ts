import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsSettingsComponent } from './products-settings.component';
import { ProductsSettingsRoutingModule } from './products-settings-routing.module';
import { AddCategoryProductComponent } from './add-category-product/add-category-product.component';
import { FormsModule } from '@angular/forms';





import { ProductsSettingsTypeComponent } from './products-settings-type/products-settings-type.component';
import { AddProductTypeComponent } from './add-product-type/add-product-type.component';
import { ProductTypeCheckUseComponent } from './product-type-check-use/product-type-check-use.component';

import { ProductsSettingsCategoryComponent } from './products-settings-category/products-settings-category.component';


@NgModule({
    imports: [
    CommonModule,
    NgbModule,
    ProductsSettingsRoutingModule,
    FormsModule,
    ProductsSettingsComponent,
    AddCategoryProductComponent,
    ProductsSettingsTypeComponent,
    AddProductTypeComponent,
    ProductsSettingsCategoryComponent
],
})
export class ProductsSettingsModule { }
