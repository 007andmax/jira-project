import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileComponent } from './company-profile.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyTimeZoneModule } from '../../companies/company-time-zone/company-time-zone.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { CompanyProfileRoutingModule } from './company-profile-routing.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { NgxMaskModule } from 'ngx-mask';
import { CompanyProfileProfileComponent } from './company-profile-profile/company-profile-profile.component';
import { CompanyProfileWorkspaceComponent } from './company-profile-workspace/company-profile-workspace.component';
import { CompanyProfileOperationalHoursComponent } from './company-profile-operational-hours/company-profile-operational-hours.component';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';



@NgModule({
    declarations: [CompanyProfileComponent, CompanyProfileProfileComponent, CompanyProfileWorkspaceComponent, CompanyProfileOperationalHoursComponent
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
        CompanyProfileRoutingModule,
        DropDownModule,
        NgxMaskModule.forRoot(),
        MatErrorModule
    ],



})
export class CompanyProfileModule { }
