import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechUsersListReportComponent } from './tech-users-list-report.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';



@NgModule({
    declarations: [TechUsersListReportComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        NgbModule,
        MatErrorModule
    ],
    exports: [TechUsersListReportComponent]



})
export class TechUsersListReportModule { }
