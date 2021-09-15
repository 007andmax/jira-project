import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechUsersComponent } from './tech-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TechUsersRoutingModule } from './tech-users-routing.module';




@NgModule({
    declarations: [TechUsersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        TechUsersRoutingModule
    ],



})
export class TechUsersModule { }
