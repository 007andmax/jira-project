import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common';
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
import { Router, RouterModule } from '@angular/router';
import { TicketsListService } from '../services/tickets-list.service';
import { TicketsPermissionsService } from '../ticket-edit-aside/services/tickets-permissions.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TicketProfile } from '../class/ticket-profile';
declare var jasmine;
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  routerState: {
    root: {}
  },
  events: of(),
};

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
        TicketDetailHeaderComponent,
        TicketDetailInfoStatusComponent,
        TicketDetailTasksComponent,
        TicketDetailMessageComponent,
        TicketDetailProfileUpdatesComponent,
        TicketDetailProfileEditUpdatesComponent,
        TicketDetailClaimInfoComponent,
        TicketDetailTotalStatisticsComponent,
        TicketDetailChangeStatusComponent,
        TicketDetailChangePriorityComponent,
        TicketDetailChangeCompanyComponent,
        TicketDetailAddAssignedUserComponent,
        TicketDetailLinkedAgentsComponent,
        TicketDetailEditTagsComponent,
        TicketDetailAttachmentsComponent,
        TicketDetailContactDetailsComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
      ,
      providers: [TicketsListService, TicketsPermissionsService, { provide: Router, useValue: mockRouter }]
    }).compileComponents();

  });

  it('check "isDisabledTicketCreator"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isDisabledTicketCreator()).toEqual(false);
  });
  it('check "onViewDocument"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.onViewDocument("test");
    expect(com.typeRigthDetailAside).toEqual("DOCUMENT_PREVIEW");
  });
  it('check "onShowMore"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.onShowMore("test");
    expect(com.toggleRigthPanel).toEqual(false);
  });
  it('check "openDetailRigthPanel"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.openDetailRigthPanel("test");
    expect(com.toggleRigthPanel).toEqual(false);
  });
  it('check "onCloseDetails"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.onCloseDetails("test");
    expect(com.toggleRigthPanel).toEqual(true);
  });
  it('check "onToggleRigthPanel"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.onToggleRigthPanel("test");
    expect(com.toggleRigthPanelContainer).toEqual(false);
  });
  it('check "onAddUpdate"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.onAddUpdate("test");
    expect(com.showFormUpdate).toEqual(true);
  });
  it('check "getNameCreateUser"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getNameCreateUser()).toEqual('');
  });
  it('check "getAgentName"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getAgentName()).toEqual('');
  });
  it('check "getCompanyName"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getCompanyName()).toEqual('');
  });
  it('check "updateListAssignedUser"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.updateListAssignedUser();
    expect(com.listAssignedUser.length).toEqual(0);
  });
  it('check "updateLisUpdateUser"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.updateLisUpdateUser();
    expect(com.lisUpdateUser.length).toEqual(0);
  });
  it('check "checkAssignedUser"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.checkAssignedUser()).toEqual(true);
  });
  it('check "checkArchivedUser"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.checkArchivedUser()).toEqual(false);
  });
  it('check "checkExistServicesProducts"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.checkExistServicesProducts()).toEqual(false);
  });
  it('check "getCompany"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getCompany()).toEqual(undefined);
  });
  it('check "getClassType"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getClassType()).toEqual('priority-icon ticket-edit-aside__ticket-subject-flag ');
  });
  it('check "getClassType"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getClassType()).toEqual('priority-icon ticket-edit-aside__ticket-subject-flag ');
  });
  it('check "onFetchUpdates"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.onFetchUpdates([]);
    expect(com.ticketProfile.updates.length).toEqual(0);
  });
  it('check "ticketProfile"', () => {
    const fixture = TestBed.createComponent(TicketDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.ticketProfile = new TicketProfile({
      "id": "09b8b4c1-28fc-4b00-8e34-3fb3fde1c099",
      "assignedUser": {
        "id": "3fb0e0c1-8648-4086-ac8a-b359812e39f8",
        "firstName": "Roman",
        "lastName": "Testovich",
        "avatar": {
          "origin": {
            "id": "21ab82d5-2a24-4c21-a668-47f40f356c1f",
            "name": "585e4bc4cb11b227491c3395.png",
            "size": 137518,
            "contentType": "image/png"
          },
          "updatedAt": 1707300148597
        },
        "accountType": "TECH",
        "email": "iwanikroman@gmail.com",
        "firstLetterOfName": null,
        "customerCompanyInfo": []
      },
      "multiAssignedUsers": [],
      "assignPerformer": {
        "id": "3fb0e0c1-8648-4086-ac8a-b359812e39f8",
        "firstName": "Roman",
        "lastName": "Testovich",
        "avatar": {
          "origin": {
            "id": "21ab82d5-2a24-4c21-a668-47f40f356c1f",
            "name": "585e4bc4cb11b227491c3395.png",
            "size": 137518,
            "contentType": "image/png"
          },
          "updatedAt": 1707300148597
        },
        "accountType": "TECH",
        "email": "iwanikroman@gmail.com",
        "firstLetterOfName": null,
        "customerCompanyInfo": []
      },
      "createdUser": {
        "id": "8056bc06-e00a-4574-bf1d-40caaef4444a",
        "firstName": "ergergeger",
        "lastName": "erger",
        "avatar": null,
        "accountType": "CLIENT",
        "email": "gerger8349ghu@example.com",
        "firstLetterOfName": null,
        "customerCompanyInfo": []
      },
      "number": "15367",
      "subject": "Sale quote #0642 ",
      "note": null,
      "previewNote": null,
      "status": "COMPLETED",
      "deviceId": null,
      "company": {
        "id": "e3943406-4072-4fa6-af60-e821ab60a27d",
        "name": "000081 v12 & 25th Dental",
        "isCompanyDeleted": false
      },
      "priorityLevel": {
        "id": "6701c5c2-23bc-45f9-9fbc-1edb623563aa",
        "color": 2,
        "name": "MEDIUM1",
        "isDefault": true,
        "isDisplay": false
      },
      "createdAt": 1743597555140,
      "closedAt": 1743597556366,
      "assignedAt": 1743597556183,
      "reassignedAt": null,
      "deletedAt": null,
      "markedAsSpamAt": null,
      "reportedAsSpamAt": null,
      "ticketSource": "FROM_SALE_QUOTE",
      "sourceName": null,
      "hashSum": null,
      "agent": null,
      "shares": [],
      "tags": [],
      "attachments": [],
      "trash": false,
      "spamMarker": null,
      "spamReporter": null,
      "deletePerformer": null,
      "closedBy": {
        "id": "3fb0e0c1-8648-4086-ac8a-b359812e39f8",
        "firstName": "Roman",
        "lastName": "Testovich",
        "avatar": {
          "origin": {
            "id": "21ab82d5-2a24-4c21-a668-47f40f356c1f",
            "name": "585e4bc4cb11b227491c3395.png",
            "size": 137518,
            "contentType": "image/png"
          },
          "updatedAt": 1707300148597
        },
        "accountType": "TECH",
        "email": "iwanikroman@gmail.com",
        "firstLetterOfName": null,
        "customerCompanyInfo": []
      },
      "unread": false,
      "isOrder": false,
      "saleQuote": false,
      "hasAttachments": false,
      "hasInvoice": true,
      "hasNewUpdates": false,
      "isBillable": false,
      "sharedToCurrentUserAt": null,
      "isSpam": null,
      "assignedUserId": "3fb0e0c1-8648-4086-ac8a-b359812e39f8",
      "companyId": "e3943406-4072-4fa6-af60-e821ab60a27d",
      "createdUserId": "8056bc06-e00a-4574-bf1d-40caaef4444a",
      "customStatus": null,
      "totalTimeWorked": 1.0,
      "totalProductsPrice": 100.00,
      "companyServiceType": "BLOCK_TIME gg",
      "updatesCount": 4
    });
    com.ticketProfile.update({ "id": "b75f80b1-1dd3-4f3b-8006-8c19cf043211", "assignedUser": { "id": "3fb0e0c1-8648-4086-ac8a-b359812e39f8", "firstName": "Roman", "lastName": "Testovich", "avatar": { "origin": { "id": "21ab82d5-2a24-4c21-a668-47f40f356c1f", "name": "585e4bc4cb11b227491c3395.png", "size": 137518, "contentType": "image/png" }, "updatedAt": 1707300148597 }, "accountType": "TECH", "email": "iwanikroman@gmail.com", "firstLetterOfName": null, "customerCompanyInfo": [] }, "multiAssignedUsers": [], "assignPerformer": { "id": "3fb0e0c1-8648-4086-ac8a-b359812e39f8", "firstName": "Roman", "lastName": "Testovich", "avatar": { "origin": { "id": "21ab82d5-2a24-4c21-a668-47f40f356c1f", "name": "585e4bc4cb11b227491c3395.png", "size": 137518, "contentType": "image/png" }, "updatedAt": 1707300148597 }, "accountType": "TECH", "email": "iwanikroman@gmail.com", "firstLetterOfName": null, "customerCompanyInfo": [] }, "createdUser": { "id": "56664563-66b1-4560-91a8-23aadac306b7", "firstName": "ergegregrege34", "lastName": "", "avatar": null, "accountType": "CLIENT", "email": "waden23o7532@hapincy.com", "firstLetterOfName": null, "customerCompanyInfo": [] }, "number": "15344", "subject": "wefwefwef", "note": "", "previewNote": "", "status": "IN_PROGRESS", "deviceId": null, "priorityLevel": { "id": "6701c5c2-23bc-45f9-9fbc-1edb623563aa", "color": 2, "name": "MEDIUM1", "isDefault": true, "isDisplay": false }, "createdAt": 1742811244519, "closedAt": null, "assignedAt": 1742811275994, "reassignedAt": null, "deletedAt": null, "markedAsSpamAt": null, "reportedAsSpamAt": null, "ticketSource": "FROM_WEB", "sourceName": "website", "hashSum": null, "agent": null, "shares": [{ "user": { "id": "56664563-66b1-4560-91a8-23aadac306b7", "firstName": "ergegregrege34", "lastName": "", "avatar": null, "accountType": "CLIENT", "email": "waden23o7532@hapincy.com", "firstLetterOfName": null, "customerCompanyInfo": [{ "companyId": "a556838c-75ab-45d2-825b-6c19445d8d3a", "isPrimaryContact": true }] } }, { "user": { "id": "56664563-66b1-4560-91a8-23aadac306b7", "firstName": "ergegregrege34", "lastName": "", "avatar": null, "accountType": "CLIENT", "email": "waden23o7532@hapincy.com", "firstLetterOfName": null, "customerCompanyInfo": [{ "companyId": "a556838c-75ab-45d2-825b-6c19445d8d3a", "isPrimaryContact": true }] } }], "tags": [], "attachments": [{ "file": { "id": "f934aeb5-bcaa-439e-a3ec-fed6fb9f9d13", "name": "ÑÑÐ°Ð¼Ð¿-ÐºÑÑÐ³Ð»Ð¾Ð³Ð¾Ð´Ð¸ÑÐ½Ð¾Ð³Ð¾-Ð³ÑÐ°Ð½Ð¶Ð°-ÑÐ¿Ð¾Ð½ÑÐ¾ÑÑÑÐ²Ð°-ÑÐ¿Ð¾Ð½ÑÐ¾ÑÑÑÐ²Ð¾-Ð»ÐµÐ½ÑÑ-163293358.jpg", "size": 62970, "contentType": "image/jpg" } }], "trash": false, "spamMarker": null, "spamReporter": null, "deletePerformer": null, "closedBy": null, "unread": false, "isOrder": false, "saleQuote": false, "hasAttachments": false, "hasInvoice": false, "hasNewUpdates": false, "isBillable": false, "sharedToCurrentUserAt": null, "isSpam": null, "assignedUserId": "3fb0e0c1-8648-4086-ac8a-b359812e39f8", "companyId": "a556838c-75ab-45d2-825b-6c19445d8d3a", "createdUserId": "56664563-66b1-4560-91a8-23aadac306b7", "customStatus": null, "totalTimeWorked": 0.0, "totalProductsPrice": 0.00, "companyServiceType": null, "updatesCount": 1 })
    expect(com.ticketProfile.attachments.length).toEqual(1);
  });
});