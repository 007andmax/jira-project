import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountComponent } from './account/account.component';
import { EmailNotificationsComponent } from './email-notifications/email-notifications.component';
import { ActivityHistoryComponent } from './activity-history/activity-history.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { AgmCoreModule } from '@agm/core';
import { MyProfileRoutingModule } from './my-profile-routing.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { SignatureComponent } from './signature/signature.component';
import { AddSignatureComponent } from './signature/add-signature/add-signature.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EditSignatureComponent } from './signature/edit-signature/edit-signature.component';
import { TicketsMyProfileComponent } from './tickets-my-profile/tickets-my-profile.component';



@NgModule({
    declarations: [MyProfileComponent,
        ProfileComponent,
        AccountComponent,
        EmailNotificationsComponent,
        ActivityHistoryComponent,
        SignatureComponent,
        AddSignatureComponent,
        EditSignatureComponent,
        TicketsMyProfileComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        AngularEditorModule,
        ImageCropperModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAbP4DFpz4f9YcXMWUjdkOdyArX2peNt8s'
        }),
        MyProfileRoutingModule,
        DropDownModule,
        NgbNavModule
    ],



})
export class MyProfileModule { }
