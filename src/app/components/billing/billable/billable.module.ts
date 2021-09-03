import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillableComponent } from './billable.component';
import { BillableItemComponent } from './billable-item/billable-item.component';
import { BillableRoutingModule } from './billable-routing.module';


@NgModule({
    declarations: [BillableComponent,
        BillableItemComponent
    ],
    imports: [
        CommonModule,
        BillableRoutingModule

    ],



})
export class BillableModule { }
