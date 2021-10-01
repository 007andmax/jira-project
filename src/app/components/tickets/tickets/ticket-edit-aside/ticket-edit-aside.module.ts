import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketEditAsideComponent } from './ticket-edit-aside.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { TicketChangeStatusComponent } from './ticket-change-status/ticket-change-status.component';
import { TicketProfileActionsComponent } from './ticket-profile-actions/ticket-profile-actions.component';
import { TicketEditTagsComponent } from './ticket-edit-tags/ticket-edit-tags.component';
import { AddAssignedUserComponent } from './add-assigned-user/add-assigned-user.component';
import { ClickOtsideDirective } from 'src/app/directives/click-otside.directive';
import { TicketClaimInfoComponent } from './ticket-claim-info/ticket-claim-info.component';
import { TicketMessageComponent } from './ticket-message/ticket-message.component';
import { TicketProfileAttachmentsComponent } from './ticket-profile-attachments/ticket-profile-attachments.component';
import { TicketProfileUpdatesComponent } from './ticket-profile-updates/ticket-profile-updates.component';
import { TicketProfileFormUpdateComponent } from './ticket-profile-form-update/ticket-profile-form-update.component';
import { TicketEditAsideRightPanelComponent } from './ticket-edit-aside-right-panel/ticket-edit-aside-right-panel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule, MatIconModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TicketProfileUpdatesNoteComponent } from './ticket-profile-updates/ticket-profile-updates-note/ticket-profile-updates-note.component';
import { TicketProfileUpdatesProductComponent } from './ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product.component';
import { TicketProfileUpdatesServiceComponent } from './ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service.component';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { UploadAreaProgressComponent } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.component';
import { TicketProfileFormUpdateProductsComponent } from './ticket-profile-form-update/ticket-profile-form-update-products/ticket-profile-form-update-products.component';
import { TicketProfileFormUpdateServicesComponent } from './ticket-profile-form-update/ticket-profile-form-update-services/ticket-profile-form-update-services.component';
import { TicketProfileFormUpdateSupportComponent } from './ticket-profile-form-update/ticket-profile-form-update-support/ticket-profile-form-update-support.component';
import { TicketEditAsideDevicesComponent } from '../ticket-edit-aside-devices/ticket-edit-aside-devices.component';
import { TicketEditAsideCompanyInfoComponent } from '../ticket-edit-aside-company-info/ticket-edit-aside-company-info.component';
import { TicketEditAsideUsersComponent } from '../ticket-edit-aside-users/ticket-edit-aside-users.component';
import { TicketProfileUpdatesNoteItemComponent } from './ticket-profile-updates/ticket-profile-updates-note/ticket-profile-updates-note-item/ticket-profile-updates-note-item.component';
import { TicketProfileUpdatesFooterComponent } from './ticket-profile-updates/ticket-profile-updates-footer/ticket-profile-updates-footer.component';
import { TicketProfileUpdatesProductItemComponent } from './ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product-item/ticket-profile-updates-product-item.component';
import { TicketProfileUpdatesServiceItemComponent } from './ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service-item/ticket-profile-updates-service-item.component';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ServicesListModule } from 'src/app/components/shared/services-list/services-list.module';
import { TicketProfileUpdatesServiceTimepickerModule } from './ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';
import { TicketProfileUpdatesServiceDurationModule } from './ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { NgxMaskModule } from 'ngx-mask';
import { PreparePhoneModule } from 'src/app/pipe/prepare-phone/prepare-phone.module';
import { PhoneModule } from 'src/app/pipe/phone/phone.module';
import { CompanyInfoHistoryComponent } from '../ticket-edit-aside-company-info/company-info-history/company-info-history.component';
import { TicketProfileUpdatesNoteInfoComponent } from './ticket-profile-updates/ticket-profile-updates-note/ticket-profile-updates-note-info/ticket-profile-updates-note-info.component';
import { TicketProfileUpdatesNoteEditComponent } from './ticket-profile-updates/ticket-profile-updates-note/ticket-profile-updates-note-edit/ticket-profile-updates-note-edit.component';
import { TicketProfileUpdatesProductInfoComponent } from './ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product-info/ticket-profile-updates-product-info.component';
import { TicketProfileUpdatesProductEditComponent } from './ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product-edit/ticket-profile-updates-product-edit.component';
import { TicketProfileUpdatesServiceInfoComponent } from './ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service-info/ticket-profile-updates-service-info.component';
import { TicketProfileUpdatesServiceEditComponent } from './ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service-edit/ticket-profile-updates-service-edit.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TehUsersModule } from 'src/app/components/shared/teh-users/teh-users.module';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';


@NgModule({
    declarations: [TicketEditAsideComponent,
        TicketChangeStatusComponent,
        TicketProfileActionsComponent,
        TicketEditTagsComponent,
        AddAssignedUserComponent,
        ClickOtsideDirective,
        TicketClaimInfoComponent,
        TicketMessageComponent,
        TicketProfileAttachmentsComponent,
        TicketProfileUpdatesComponent,
        TicketProfileFormUpdateComponent,
        TicketEditAsideRightPanelComponent,
        TicketProfileUpdatesNoteComponent,
        TicketProfileUpdatesProductComponent,
        TicketProfileUpdatesServiceComponent,
        TicketProfileFormUpdateProductsComponent,
        TicketProfileFormUpdateServicesComponent,
        TicketProfileFormUpdateSupportComponent,
        TicketEditAsideDevicesComponent,
        TicketEditAsideCompanyInfoComponent,
        TicketEditAsideUsersComponent,
        TicketProfileUpdatesNoteItemComponent,
        TicketProfileUpdatesFooterComponent,
        TicketProfileUpdatesProductItemComponent,
        TicketProfileUpdatesServiceItemComponent,
        CompanyInfoHistoryComponent,
        TicketProfileUpdatesNoteInfoComponent,
        TicketProfileUpdatesNoteEditComponent,
        TicketProfileUpdatesProductInfoComponent,
        TicketProfileUpdatesProductEditComponent,
        TicketProfileUpdatesServiceInfoComponent,
        TicketProfileUpdatesServiceEditComponent,


    ],
    imports: [
        CommonModule,
        DynamicTooltipModule,
        NgbModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        ReactiveFormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        TextAreaModule,
        ProductListModule,
        FormsModule,
        NumberModule,
        ServicesListModule,
        TicketProfileUpdatesServiceTimepickerModule,
        TicketProfileUpdatesServiceDurationModule,
        DatePickerModule,
        NgxMaskModule,
        PreparePhoneModule,
        PhoneModule,
        InfiniteScrollModule,
        TehUsersModule,
        UploadAreaProgressModule

    ],
    exports: [TicketEditAsideComponent, ClickOtsideDirective,]
})
export class TicketEditAsideModule { }
