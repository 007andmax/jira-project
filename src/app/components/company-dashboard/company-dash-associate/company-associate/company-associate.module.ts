import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule, MatIconModule, MatSelectModule } from '@angular/material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CompanyAssociateComponent } from './company-associate.component';

@NgModule({
    declarations: [CompanyAssociateComponent

    ],
    imports: [
        CommonModule,
        MatChipsModule,
        FormsModule,
        MatSelectModule,
        NgbModule,
        MatIconModule,
        ReactiveFormsModule,
    ],
    exports: [CompanyAssociateComponent]



})
export class CompanyAssociateModule { }
