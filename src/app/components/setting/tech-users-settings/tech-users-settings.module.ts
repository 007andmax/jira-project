import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { TechUsersSettingsComponent } from './tech-users-settings.component';
import { TechUsersSettingsRoutingModule } from './tech-users-routing.module';




@NgModule({
    declarations: [TechUsersSettingsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        TechUsersSettingsRoutingModule,
        DisabledBtnModule,
        PreloaderTicketModule
    ],



})
export class TechUsersSettingsModule { }
