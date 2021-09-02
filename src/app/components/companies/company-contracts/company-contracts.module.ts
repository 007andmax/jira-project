import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyContractsComponent } from './company-contracts.component';
import { ContractsHeaderModule } from '../../billing/contracts/contracts-header/contracts-header.module';
import { ContractsTableModule } from '../../billing/contracts/contracts-table/contracts-table.module';
import { ContractsPreviewModule } from '../../billing/contracts/contracts-preview/contracts-preview.module';
import { ContractsAsideModule } from '../../billing/contracts/contracts-aside/contracts-aside.module';
import { ContractsEditModule } from '../../billing/contracts/contracts-edit/contracts-edit.module';
import { CompanyContractsRoutingModule } from './company-contracts-routing.module';


@NgModule({
    declarations: [CompanyContractsComponent
    ],
    imports: [
        CommonModule,
        ContractsHeaderModule,
        ContractsTableModule,
        ContractsPreviewModule,
        ContractsAsideModule,
        ContractsEditModule,
        CompanyContractsRoutingModule
    ],



})
export class CompanyContractsModule { }
