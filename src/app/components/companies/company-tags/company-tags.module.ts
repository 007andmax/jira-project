import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyTagsComponent } from './company-tags.component';
import { MatChipsModule, MatIconModule, MatSelectModule } from '@angular/material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
    declarations: [CompanyTagsComponent

    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        NgbModule,
        InfiniteScrollModule,

    ],
    exports: [CompanyTagsComponent]



})
export class CompanyTagsModule { }
