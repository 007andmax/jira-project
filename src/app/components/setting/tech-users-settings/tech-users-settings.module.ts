import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { TechUsersSettingsComponent } from './tech-users-settings.component';
import { TechUsersSettingsRoutingModule } from './tech-users-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PermissionManageComponent } from './permission-manage/permission-manage.component';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { TechUsersReassignComponent } from './tech-users-reassign/tech-users-reassign.component';




@NgModule({
    declarations: [TechUsersSettingsComponent,
        PermissionManageComponent,
        TechUsersReassignComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        TechUsersSettingsRoutingModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        DynamicTooltipModule,
        DropDownModule

    ],
    entryComponents: [TechUsersReassignComponent]
})
export class TechUsersSettingsModule { }
