import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyDevicesTagsComponent } from './company-devices-tags.component';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
    declarations: [
        CompanyDevicesTagsComponent
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
    exports: [CompanyDevicesTagsComponent]



})
export class CompanyDevicesTagsModule { }
