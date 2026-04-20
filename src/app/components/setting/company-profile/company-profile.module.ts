import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileComponent } from './company-profile.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyProfileRoutingModule } from './company-profile-routing.module';

import { NgxMaskModule } from 'ngx-mask';
import { CompanyProfileProfileComponent } from './company-profile-profile/company-profile-profile.component';
import { CompanyProfileWorkspaceComponent } from './company-profile-workspace/company-profile-workspace.component';
import { CompanyProfileOperationalHoursComponent } from './company-profile-operational-hours/company-profile-operational-hours.component';

import { CompanyProfileApiKeysComponent } from './company-profile-api-keys/company-profile-api-keys.component';
import { CompanyProfileApiKeysAddAsideComponent } from './company-profile-api-keys/company-profile-api-keys-add-aside/company-profile-api-keys-add-aside.component';


import { CompanyProfileApiKeysEditAsideComponent } from './company-profile-api-keys/company-profile-api-keys-edit-aside/company-profile-api-keys-edit-aside.component';



@NgModule({
    declarations: [CompanyProfileComponent, CompanyProfileProfileComponent, CompanyProfileWorkspaceComponent, CompanyProfileOperationalHoursComponent, CompanyProfileApiKeysComponent, CompanyProfileApiKeysAddAsideComponent, CompanyProfileApiKeysEditAsideComponent
    ],
    imports: [
    CommonModule,
    ImageCropperModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    CompanyProfileRoutingModule,
    NgxMaskModule.forRoot()
],



})
export class CompanyProfileModule { }
