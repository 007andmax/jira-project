import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountComponent } from './account/account.component';
import { EmailNotificationsComponent } from './email-notifications/email-notifications.component';
import { ActivityHistoryComponent } from './activity-history/activity-history.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { AgmCoreModule } from '@agm/core';
import { MyProfileRoutingModule } from './my-profile-routing.module';



@NgModule({
    declarations: [MyProfileComponent,
        ProfileComponent,
        AccountComponent,
        EmailNotificationsComponent,
        ActivityHistoryComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        ImageCropperModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAbP4DFpz4f9YcXMWUjdkOdyArX2peNt8s'
        }),
        MyProfileRoutingModule
    ],



})
export class MyProfileModule { }
