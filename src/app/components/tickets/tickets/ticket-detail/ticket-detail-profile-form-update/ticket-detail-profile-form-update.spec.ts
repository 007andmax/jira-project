import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { ServicesListModule } from 'src/app/components/shared/services-list/services-list.module';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { TicketProfileUpdatesServiceDurationModule } from '../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { TicketProfileUpdatesServiceTimepickerModule } from '../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';
import { TicketProfileFormUpdateNoteListModule } from '../ticket-profile-form-update-note-list/ticket-profile-form-update-note-list.module';
import { TicketDetailProfileFormUpdateHeaderModule } from './ticket-detail-profile-form-update-header/ticket-detail-profile-form-update-header.module';
import { TicketDetailProfileFormUpdateNoteModule } from './ticket-detail-profile-form-update-note/ticket-detail-profile-form-update-note.module';
import { TicketDetailProfileFormUpdateProductsComponent } from './ticket-detail-profile-form-update-products/ticket-detail-profile-form-update-products.component';
import { TicketDetailProfileFormUpdateServicesComponent } from './ticket-detail-profile-form-update-services/ticket-detail-profile-form-update-services.component';
import { TicketDetailProfileFormUpdateSupportComponent } from './ticket-detail-profile-form-update-support/ticket-detail-profile-form-update-support.component';
import { TicketDetailProfileFormUpdateVisibleUsersComponent } from './ticket-detail-profile-form-update-visible-users/ticket-detail-profile-form-update-visible-users.component';
import { TicketDetailProfileFormUpdateComponent } from './ticket-detail-profile-form-update.component';

describe('TicketDetailProfileFormUpdateComponent unit test', () => {
  let component: TicketDetailProfileFormUpdateComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        CommonModule,
        NgbModule,
        DisabledBtnModule,
        TicketProfileFormUpdateNoteListModule,
        PreloaderTicketModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule,
        FormsModule,
        ReactiveFormsModule,
        UploadAreaProgressModule,
        ProductListModule,
        InvoiceFormTicketEditTaxesModule,
        NumberModule,
        DecimalNumberModule,
        ToFixedModule,
        ServicesListModule,
        TicketProfileUpdatesServiceTimepickerModule,
        TicketProfileUpdatesServiceDurationModule,
        DatePickerModule,
        DynamicTooltipModule,
        TicketDetailProfileFormUpdateHeaderModule,
        TicketDetailProfileFormUpdateNoteModule,
        NoopAnimationsModule
      ],
      declarations: [TicketDetailProfileFormUpdateComponent,
        TicketDetailProfileFormUpdateProductsComponent,
        TicketDetailProfileFormUpdateServicesComponent,
        TicketDetailProfileFormUpdateSupportComponent,
        TicketDetailProfileFormUpdateVisibleUsersComponent
      ],
      providers: [FormBuilder]
    }).compileComponents();

  });

  it('check "reset"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateComponent);
    const com = fixture.debugElement.componentInstance;
    com.tab = null;
    com.reset();
    expect(com.tab).toEqual("NOTE")
    expect(com.files.length).toEqual(0)
    expect(com.showAddUpdateUser).toEqual(false)
  });
  it('check "checkUpdateAndClose"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.checkUpdateAndClose()).toEqual(true)
  });
  it('check "onToggleAddUpdateUser"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateComponent);
    const com = fixture.debugElement.componentInstance;
    com.onToggleAddUpdateUser();
    expect(com.showAddUpdateUser).toEqual(true)
  });
  it('check "formatBytes"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.formatBytes(1024)).toEqual("1 KB");
  });
  it('check "isShowAddUpdate"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isShowAddUpdate()).toEqual(true);
  });
});