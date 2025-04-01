import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { NoteTemplate } from 'src/app/components/setting/ticket-settings-page/canned-responses/class/note-template';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { ServicesListModule } from 'src/app/components/shared/services-list/services-list.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { DndModule } from 'src/app/directives/dnd/dnd.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { PhoneModule } from 'src/app/pipe/phone/phone.module';
import { PreparePhoneModule } from 'src/app/pipe/prepare-phone/prepare-phone.module';
import { CompanyUsersDropDownModule } from '../ticket-add-aside/company-users-drop-down/company-users-drop-down.module';
import { AddAssignedUserModule } from '../ticket-edit-aside/add-assigned-user/add-assigned-user.module';
import { TicketChangeStatusModule } from '../ticket-edit-aside/ticket-change-status/ticket-change-status.module';
import { TicketProfileAttachmentsModule } from '../ticket-edit-aside/ticket-profile-attachments/ticket-profile-attachments.module';
import { TicketProfileUpdatesServiceDurationModule } from '../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { TicketProfileUpdatesServiceTimepickerModule } from '../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';
import { TicketDetailProfileFormUpdateModule } from './ticket-detail-profile-form-update/ticket-detail-profile-form-update.module';
import { TicketDetailRoutingModule } from './ticket-detail-routing.module';
import { TicketDetailComponent } from './ticket-detail.component';
import { TicketProfileFormUpdateNoteListComponent } from './ticket-profile-form-update-note-list/ticket-profile-form-update-note-list.component';
import { TicketProfileFormUpdateNoteListModule } from './ticket-profile-form-update-note-list/ticket-profile-form-update-note-list.module';
import { TicketDetailAddAssignedUserComponent } from './ticket-detail-add-assigned-user/ticket-detail-add-assigned-user.component';
import { TicketDetailAttachmentsComponent } from './ticket-detail-attachments/ticket-detail-attachments.component';
import { TicketDetailChangeCompanyComponent } from './ticket-detail-change-company/ticket-detail-change-company.component';
import { TicketDetailChangePriorityComponent } from './ticket-detail-change-priority/ticket-detail-change-priority.component';
import { TicketDetailChangeStatusComponent } from './ticket-detail-change-status/ticket-detail-change-status.component';
import { TicketDetailClaimInfoComponent } from './ticket-detail-claim-info/ticket-detail-claim-info.component';
import { TicketDetailContactDetailsHistoryComponent } from './ticket-detail-contact-details/ticket-detail-contact-details-history/ticket-detail-contact-details-history.component';
import { TicketDetailContactDetailsComponent } from './ticket-detail-contact-details/ticket-detail-contact-details.component';
import { TicketDetailContactComponent } from './ticket-detail-contact/ticket-detail-contact.component';
import { TicketDetailDevicesDetailsComponent } from './ticket-detail-devices/ticket-detail-devices-details/ticket-detail-devices-details.component';
import { TicketDetailDevicesItemComponent } from './ticket-detail-devices/ticket-detail-devices-item/ticket-detail-devices-item.component';
import { TicketDetailDevicesComponent } from './ticket-detail-devices/ticket-detail-devices.component';
import { TicketDetailDocumentsDetailsComponent } from './ticket-detail-documents/ticket-detail-documents-details/ticket-detail-documents-details.component';
import { TicketDetailDocumentsPreviewComponent } from './ticket-detail-documents/ticket-detail-documents-preview/ticket-detail-documents-preview.component';
import { TicketDetailDocumentsComponent } from './ticket-detail-documents/ticket-detail-documents.component';
import { TicketDetailEditTagsComponent } from './ticket-detail-edit-tags/ticket-detail-edit-tags.component';
import { TicketDetailHeaderComponent } from './ticket-detail-header/ticket-detail-header.component';
import { TicketDetailInfoStatusComponent } from './ticket-detail-info-status/ticket-detail-info-status.component';
import { TicketDetailLinkedAgentsComponent } from './ticket-detail-linked-agents/ticket-detail-linked-agents.component';
import { TicketDetailMessageComponent } from './ticket-detail-message/ticket-detail-message.component';
import { TicketDetailPasswordsDetailsComponent } from './ticket-detail-passwords/ticket-detail-passwords-details/ticket-detail-passwords-details.component';
import { TicketDetailPasswordsItemComponent } from './ticket-detail-passwords/ticket-detail-passwords-item/ticket-detail-passwords-item.component';
import { TicketDetailPasswordsComponent } from './ticket-detail-passwords/ticket-detail-passwords.component';
import { TicketDetailProfileEditUpdatesHeaderComponent } from './ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates-header/ticket-detail-profile-edit-updates-header.component';
import { TicketDetailProfileEditUpdatesProductsComponent } from './ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates-products/ticket-detail-profile-edit-updates-products.component';
import { TicketDetailProfileEditUpdatesServicesComponent } from './ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates-services/ticket-detail-profile-edit-updates-services.component';
import { TicketDetailProfileEditUpdatesComponent } from './ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates.component';
import { TicketDetailProfileUpdatesHeaderInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-header-info/ticket-detail-profile-updates-header-info.component';
import { TicketDetailProfileUpdatesNoteEditComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note-edit/ticket-detail-profile-updates-note-edit.component';
import { TicketDetailProfileUpdatesNoteInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note-info/ticket-detail-profile-updates-note-info.component';
import { TicketDetailProfileUpdatesNoteItemComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note-item/ticket-detail-profile-updates-note-item.component';
import { TicketDetailProfileUpdatesNoteComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note.component';
import { TicketDetailProfileUpdatesProductEditComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-edit/ticket-detail-profile-updates-product-edit.component';
import { TicketDetailProfileUpdatesProductHeaderInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-header-info/ticket-detail-profile-updates-product-header-info.component';
import { TicketDetailProfileUpdatesProductInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-info/ticket-detail-profile-updates-product-info.component';
import { TicketDetailProfileUpdatesProductItemComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-item/ticket-detail-profile-updates-product-item.component';
import { TicketDetailProfileUpdatesProductComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product.component';
import { TicketDetailProfileUpdatesServiceHeaderInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service-header-info/ticket-detail-profile-updates-service-header-info.component';
import { TicketDetailProfileUpdatesServiceInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service-info/ticket-detail-profile-updates-service-info.component';
import { TicketDetailProfileUpdatesServiceItemComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service-item/ticket-detail-profile-updates-service-item.component';
import { TicketDetailProfileUpdatesServiceComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service.component';
import { TicketDetailProfileUpdatesComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates.component';
import { TicketDetailTasksComponent } from './ticket-detail-tasks/ticket-detail-tasks.component';
import { TicketDetailTicketsDetailsComponent } from './ticket-detail-tickets/ticket-detail-tickets-details/ticket-detail-tickets-details.component';
import { TicketDetailTicketsStatusComponent } from './ticket-detail-tickets/ticket-detail-tickets-status/ticket-detail-tickets-status.component';
import { TicketDetailTicketsComponent } from './ticket-detail-tickets/ticket-detail-tickets.component';
import { TicketDetailTotalStatisticsComponent } from './ticket-detail-total-statistics/ticket-detail-total-statistics.component';
import { Router } from '@angular/router';
import { TicketsListService } from '../services/tickets-list.service';
import { TicketsPermissionsService } from '../ticket-edit-aside/services/tickets-permissions.service';
declare var jasmine;
class RouterStub {
  navigateByUrl(url: string) {
    return url;
  }
}
describe('TicketDetailComponent unit test', () => {
  let component: TicketDetailComponent;
  let fixture: ComponentFixture<TicketDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule,
        TicketDetailRoutingModule,
        DynamicTooltipModule,
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
        NgxMaskModule.forRoot(),
        PreparePhoneModule,
        PhoneModule,
        InfiniteScrollModule,
        TechUsersModule,
        UploadAreaProgressModule,
        ClickOutsideModule,
        TicketProfileAttachmentsModule,
        PreviewPhoneMaskModule,
        InvoiceFormTicketEditTaxesModule,
        TicketChangeStatusModule,
        AddAssignedUserModule,
        TicketProfileFormUpdateNoteListModule,
        KeyUpEnterModule,
        DropDownModule,
        CompanyDropDownModule,
        DndModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule,
        CompanyUsersDropDownModule,
        DecimalNumberModule,
        ToFixedModule,
        TicketDetailProfileFormUpdateModule,
        AngularEditorModule,
        RouterTestingModule],
      declarations: [TicketDetailComponent,
        TicketDetailProfileUpdatesComponent,
        TicketDetailProfileUpdatesNoteComponent,
        TicketDetailProfileUpdatesNoteItemComponent,
        TicketDetailProfileUpdatesNoteInfoComponent,
        TicketDetailProfileUpdatesNoteEditComponent,
        TicketDetailProfileUpdatesHeaderInfoComponent,
        TicketDetailProfileUpdatesProductComponent,
        TicketDetailProfileUpdatesProductItemComponent,
        TicketDetailProfileUpdatesProductInfoComponent,
        TicketDetailProfileUpdatesProductEditComponent,
        TicketDetailProfileUpdatesProductHeaderInfoComponent,
        TicketDetailProfileUpdatesServiceComponent,
        TicketDetailProfileUpdatesServiceItemComponent,
        TicketDetailProfileUpdatesServiceInfoComponent,
        TicketDetailProfileUpdatesServiceHeaderInfoComponent,
        TicketDetailTasksComponent,
        TicketDetailHeaderComponent,
        // TicketDetailProfileFormUpdateComponent,
        //  TicketDetailProfileFormUpdateVisibleUsersComponent,
        //  TicketDetailProfileFormUpdateNoteComponent,
        //   TicketDetailProfileFormUpdateServicesComponent,
        //  TicketDetailProfileFormUpdateHeaderComponent,
        //  TicketDetailProfileFormUpdateProductsComponent,
        TicketDetailClaimInfoComponent,
        TicketDetailInfoStatusComponent,
        TicketDetailChangeStatusComponent,
        TicketDetailChangePriorityComponent,
        TicketDetailChangeCompanyComponent,
        TicketDetailAddAssignedUserComponent,
        TicketDetailEditTagsComponent,
        TicketDetailAttachmentsComponent,
        TicketDetailLinkedAgentsComponent,
        TicketDetailProfileEditUpdatesComponent,
        TicketDetailProfileEditUpdatesHeaderComponent,
        TicketDetailProfileEditUpdatesServicesComponent,
        TicketDetailProfileEditUpdatesProductsComponent,
        TicketDetailMessageComponent,
        TicketDetailContactComponent,
        TicketDetailPasswordsComponent,
        TicketDetailDevicesComponent,
        TicketDetailDocumentsComponent,
        TicketDetailContactDetailsComponent,
        TicketDetailContactDetailsHistoryComponent,
        TicketDetailDocumentsPreviewComponent,
        TicketDetailDocumentsDetailsComponent,
        TicketDetailPasswordsItemComponent,
        TicketDetailPasswordsDetailsComponent,
        TicketDetailDevicesItemComponent,
        TicketDetailDevicesDetailsComponent,
        //   TicketDetailProfileFormUpdateSupportComponent,
        //  AddAssignedUserNoteComponent,
        TicketDetailTicketsDetailsComponent,
        TicketDetailTicketsComponent,
        TicketDetailTicketsStatusComponent,
        TicketDetailTotalStatisticsComponent,
      ],
      providers: [TicketsListService, TicketsPermissionsService, { provide: Router, useClass: RouterStub }]
    }).compileComponents();

  });

  it('check "isDisabledTicketCreator"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isDisabledTicketCreator()).toEqual(false);
  });
});