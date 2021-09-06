import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsComponent } from './contracts.component';
import { ContractsHeaderModule } from './contracts-header/contracts-header.module';
import { ContractsTableModule } from './contracts-table/contracts-table.module';
import { ContractsPreviewModule } from './contracts-preview/contracts-preview.module';
import { ContractsAsideModule } from './contracts-aside/contracts-aside.module';
import { ContractsEditModule } from './contracts-edit/contracts-edit.module';
import { ContractsRoutingModule } from './contracts-routing.module';



@NgModule({
    declarations: [ContractsComponent

    ],
    imports: [
        CommonModule,
        ContractsHeaderModule,
        ContractsTableModule,
        ContractsPreviewModule,
        ContractsAsideModule,
        ContractsEditModule,
        ContractsRoutingModule

    ],



})
export class ContractsModule { }
