import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsSettingsComponent } from './products-settings.component';
import { ProductsSettingsRoutingModule } from './products-settings-routing.module';
import { AddCategoryProductComponent } from './add-category-product/add-category-product.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { GlNumbersDropDownModule } from '../../inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { ProductsSettingsTypeComponent } from './products-settings-type/products-settings-type.component';
import { AddProductTypeComponent } from './add-product-type/add-product-type.component';
import { ProductTypeCheckUseComponent } from './product-type-check-use/product-type-check-use.component';
import { ProductTypeCheckUseModule } from './product-type-check-use/product-type-check-use.module';
import { ProductsSettingsCategoryComponent } from './products-settings-category/products-settings-category.component';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';

@NgModule({
    declarations: [
        ProductsSettingsComponent,
        AddCategoryProductComponent,
        ProductsSettingsTypeComponent,
        AddProductTypeComponent,
        ProductsSettingsCategoryComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        ProductsSettingsRoutingModule,
        FormsModule,
        ClickOutsideModule,
        DynamicTooltipModule,
        DropDownModule,
        KeyUpEnterModule,
        GlNumbersDropDownModule,
        ProductTypeCheckUseModule,
        MatErrorModule
    ],



})
export class ProductsSettingsModule { }
