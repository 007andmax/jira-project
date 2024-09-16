import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechUsersListReportComponent } from './tech-users-list-report.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';



@NgModule({
    declarations: [TechUsersListReportComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        MatErrorModule
    ],
    exports: [TechUsersListReportComponent]



})
export class TechUsersListReportModule { }
