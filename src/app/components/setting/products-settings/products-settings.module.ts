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



@NgModule({
    declarations: [
        ProductsSettingsComponent,
        AddCategoryProductComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        ProductsSettingsRoutingModule,
        FormsModule,
        ClickOtsideModule,
        DynamicTooltipModule,
        MatFormFieldModule
    ],



})
export class ProductsSettingsModule { }
