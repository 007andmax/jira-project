import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';


import { TechUsersSettingsComponent } from './tech-users-settings.component';
import { TechUsersSettingsRoutingModule } from './tech-users-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PermissionManageComponent } from './permission-manage/permission-manage.component';


import { TechUsersReassignComponent } from './tech-users-reassign/tech-users-reassign.component';





@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    TechUsersSettingsRoutingModule,
    NgbModule,
    TechUsersSettingsComponent,
    PermissionManageComponent,
    TechUsersReassignComponent
]
})
export class TechUsersSettingsModule { }
