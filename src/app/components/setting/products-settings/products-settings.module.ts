import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsSettingsComponent } from './products-settings.component';
import { ProductsSettingsRoutingModule } from './products-settings-routing.module';



@NgModule({
    declarations: [
        ProductsSettingsComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        ProductsSettingsRoutingModule
    ],



})
export class ProductsSettingsModule { }
