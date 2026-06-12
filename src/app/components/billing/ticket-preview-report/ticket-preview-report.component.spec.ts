import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { IntegerModule } from 'src/app/directives/integer/integer.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { FilterModule } from 'src/app/pipe/filter/filter.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { ServicesListModule } from '../../shared/services-list/services-list.module';
import { TicketProfileUpdatesServiceDurationModule } from '../../tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { TicketProfileUpdatesServiceTimepickerModule } from '../../tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';
import { TicketsTableItemStatusModule } from '../../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-status/tickets-table-item-status.module';
import { ContractsAsideDiscountModule } from '../contracts/contracts-aside/contracts-aside-discount/contracts-aside-discount.module';
import { TicketPreviewReportHeaderComponent } from './ticket-preview-report-header/ticket-preview-report-header.component';
import { TicketPreviewReportProductItemDropDownComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item-drop-down/ticket-preview-report-product-item-drop-down.component';
import { TicketPreviewReportProductItemManufactureComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item-manufacture/ticket-preview-report-product-item-manufacture.component';
import { TicketPreviewReportProductItemComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item.component';
import { TicketPreviewReportRoutingModule } from './ticket-preview-report-routing.module';
import { TicketPreviewReportServiceItemComponent } from './ticket-preview-report-service-item/ticket-preview-report-service-item.component';
import { TicketPreviewReportStatusDropDownComponent } from './ticket-preview-report-status-drop-down/ticket-preview-report-status-drop-down.component';
import { TicketPreviewReportComponent } from './ticket-preview-report.component';


describe('TicketPreviewReportComponent unit test', () => {
  let component: TicketPreviewReportComponent;
  let fixture: ComponentFixture<TicketPreviewReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        TicketPreviewReportRoutingModule,
        DecimalNumberModule,
        ToFixedModule,
        MatErrorModule,
        DatePickerModule,
        NgbModule,
        FilterModule,
        DynamicTooltipModule,
        ContractsAsideDiscountModule,
        ServicesListModule,
        TicketProfileUpdatesServiceTimepickerModule,
        TicketProfileUpdatesServiceDurationModule,
        TextAreaModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NumberModule,
        IntegerModule,
        TicketsTableItemStatusModule,
        MultiDatepickerModule,
        DropDownModule,
        InfiniteScrollModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule],
    declarations: [TicketPreviewReportComponent, TicketPreviewReportProductItemComponent, TicketPreviewReportProductItemDropDownComponent, TicketPreviewReportServiceItemComponent, TicketPreviewReportProductItemManufactureComponent, TicketPreviewReportHeaderComponent, TicketPreviewReportStatusDropDownComponent]
}).compileComponents();

  });

  it('check "checkClose"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportComponent);
    const com = fixture.debugElement.componentInstance;

    expect(com.checkClose({ services: [{ completed: false }], products: [{ completed: false }] })).toEqual(false);
  });
  it('check "getDataForClose"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportComponent);
    const com = fixture.debugElement.componentInstance;

    expect(com.getDataForClose({ id: "test" })).toEqual({
      note: "Ticket has been closed",
      type: "NOTE",
      noteType: "PUBLIC",
      shares: [],
      ticket: { id: "test" },
      attachments: []
    });
  });
  it('check "getDuration"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDuration(2)).toEqual("02:00 hr(s)");
  });

});