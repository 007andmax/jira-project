import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechUsersComponent } from './tech-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TechUsersRoutingModule } from './tech-users-routing.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';




@NgModule({
    declarations: [TechUsersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        TechUsersRoutingModule,
        DisabledBtnModule,
        PreloaderTicketModule
    ],



})
export class TechUsersModule { }
