import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsStatisticsComponent } from './contracts-statistics.component';
import { ContractsStatisticsRoutingModule } from './contracts-statistics-routing.module';
import { ContractsStatisticsTableComponent } from './contracts-statistics-table/contracts-statistics-table.component';
import { ContractsStatisticsTableItemComponent } from './contracts-statistics-table/contracts-statistics-table-item/contracts-statistics-table-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    imports: [
    CommonModule,
    ContractsStatisticsRoutingModule,
    NgbModule,
    ContractsStatisticsComponent,
    ContractsStatisticsTableComponent,
    ContractsStatisticsTableItemComponent
],
})
export class ContractsStatisticsModule { }
