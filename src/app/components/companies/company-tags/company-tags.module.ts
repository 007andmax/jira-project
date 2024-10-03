import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyTagsComponent } from './company-tags.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';


@NgModule({
    declarations: [CompanyTagsComponent

    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        NgbModule,
        InfiniteScrollModule,

    ],
    exports: [CompanyTagsComponent]



})
export class CompanyTagsModule { }
