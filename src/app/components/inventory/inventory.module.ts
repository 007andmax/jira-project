import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { InventoryHeaderComponent } from './inventory-header/inventory-header.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InventoryTableComponent } from './inventory-table/inventory-table.component';
import { FormsModule } from '@angular/forms';
import { InventoryFilterComponent } from './inventory-header/inventory-filter/inventory-filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from '../shared/drop-down/drop-down.module';
import { InventoryAddCategoryComponent } from './inventory-add-category/inventory-add-category.component';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { InventoryRoutingModule } from './inventory-routing.module';
import { ContractsEditModule } from '../billing/contracts/contracts-edit/contracts-edit.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { InvoiceFormTicketEditTaxesModule } from '../billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { TaxesModule } from '../shared/taxes/taxes.module';
import { InventoryChangeProductTypeComponent } from './inventory-change-product-type/inventory-change-product-type.component';
import { InventoryChangeProductTypeModule } from './inventory-change-product-type/inventory-change-product-type.module';


@NgModule({
    declarations: [InventoryComponent,
        InventoryHeaderComponent,
        InventoryTableComponent,
        InventoryFilterComponent,
        InventoryAddCategoryComponent
    ],
    imports: [
        CommonModule,
        InfiniteScrollModule,
        FormsModule,
        NgbModule,
        DropDownModule,
        MatSelectModule,
        MatChipsModule,
        InventoryRoutingModule,
        ContractsEditModule,
        DecimalNumberModule,
        ToFixedModule,
        TaxesModule,
        TextAreaModule,
        InventoryChangeProductTypeModule

    ],



})
export class InventoryModule { }
