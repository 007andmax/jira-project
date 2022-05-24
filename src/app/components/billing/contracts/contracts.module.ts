import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsComponent } from './contracts.component';
import { ContractsHeaderModule } from './contracts-header/contracts-header.module';
import { ContractsTableModule } from './contracts-table/contracts-table.module';
import { ContractsPreviewModule } from './contracts-preview/contracts-preview.module';
import { ContractsAsideModule } from './contracts-aside/contracts-aside.module';
import { ContractsEditModule } from './contracts-edit/contracts-edit.module';
import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsReviewComponent } from './contracts-review/contracts-review.component';
import { ContractsReviewModule } from './contracts-review/contracts-review.module';



@NgModule({
    declarations: [ContractsComponent,
        //  ContractsReviewComponent

    ],
    imports: [
        CommonModule,
        ContractsHeaderModule,
        ContractsTableModule,
        ContractsPreviewModule,
        ContractsAsideModule,
        ContractsEditModule,
        ContractsRoutingModule,
        ContractsReviewModule

    ],



})
export class ContractsModule { }
