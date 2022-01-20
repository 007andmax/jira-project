import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsTableComponent } from './contracts-table.component';
import { ContractsTableItemComponent } from './contracts-table-item/contracts-table-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [ContractsTableComponent,
        ContractsTableItemComponent
    ],
    imports: [
        CommonModule,
        NgbModule

    ],
    exports: [ContractsTableComponent]


})
export class ContractsTableModule { }
