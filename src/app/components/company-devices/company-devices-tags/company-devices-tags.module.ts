import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyDevicesTagsComponent } from './company-devices-tags.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';


@NgModule({
    declarations: [
        CompanyDevicesTagsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        InfiniteScrollModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule
    ],
    exports: [CompanyDevicesTagsComponent]



})
export class CompanyDevicesTagsModule { }
