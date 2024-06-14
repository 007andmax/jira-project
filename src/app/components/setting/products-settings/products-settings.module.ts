import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsSettingsComponent } from './products-settings.component';
import { ProductsSettingsRoutingModule } from './products-settings-routing.module';
import { AddCategoryProductComponent } from './add-category-product/add-category-product.component';
import { FormsModule } from '@angular/forms';
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatFormFieldModule } from '@angular/material';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { GlNumbersDropDownModule } from '../../inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { ProductsSettingsTypeComponent } from './products-settings-type/products-settings-type.component';
import { AddProductTypeComponent } from './add-product-type/add-product-type.component';

@NgModule({
    declarations: [
        ProductsSettingsComponent,
        AddCategoryProductComponent,
        ProductsSettingsTypeComponent,
        AddProductTypeComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        ProductsSettingsRoutingModule,
        FormsModule,
        ClickOtsideModule,
        DynamicTooltipModule,
        MatFormFieldModule,
        DropDownModule,
        KeyUpEnterModule,
        GlNumbersDropDownModule
    ],



})
export class ProductsSettingsModule { }
