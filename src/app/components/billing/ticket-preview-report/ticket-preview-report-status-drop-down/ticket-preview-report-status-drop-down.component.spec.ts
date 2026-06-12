import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { TicketPreviewReportStatusDropDownComponent } from './ticket-preview-report-status-drop-down.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';


describe('TicketPreviewReportStatusDropDownComponent unit test', () => {
  let component: TicketPreviewReportStatusDropDownComponent;
  let fixture: ComponentFixture<TicketPreviewReportStatusDropDownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        NgbModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule],
    declarations: [TicketPreviewReportStatusDropDownComponent]
}).compileComponents();

  });
  it('check "parseStatus"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportStatusDropDownComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.parseStatus("IN_PROGRESS")).toEqual("In progress");
  });

});