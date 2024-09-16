import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUploaderModule } from 'ngx-uploader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';




@NgModule({
    declarations: [DashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxUploaderModule,
        NgbModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        DropDownModule,
        MatChipModule,
        MatChipListModule,
    ],
})
export class DashboardModule { }
