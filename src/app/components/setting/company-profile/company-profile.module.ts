import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileComponent } from './company-profile.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyTimeZoneModule } from '../../companies/company-time-zone/company-time-zone.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { CompanyProfileRoutingModule } from './company-profile-routing.module';



@NgModule({
    declarations: [CompanyProfileComponent
    ],
    imports: [
        CommonModule,
        ImageCropperModule,
        ReactiveFormsModule,
        CompanyTimeZoneModule,
        NgbModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        CompanyProfileRoutingModule
    ],



})
export class CompanyProfileModule { }
