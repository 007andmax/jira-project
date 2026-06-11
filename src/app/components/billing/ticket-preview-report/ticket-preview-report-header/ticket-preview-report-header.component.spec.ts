import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { TicketPreviewReportHeaderComponent } from './ticket-preview-report-header.component';



describe('TicketPreviewReportHeaderComponent unit test', () => {
  let component: TicketPreviewReportHeaderComponent;
  let fixture: ComponentFixture<TicketPreviewReportHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TicketPreviewReportHeaderComponent
      ]
    }).compileComponents();

  });

  it('check "onSelectStatus"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectStatus([{ id: "test" }]);
    expect(com.selectedTicketStatus).toEqual([{ id: "test" }]);
  });
  it('check "parseStatus"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.parseStatus("IN_PROGRESS")).toEqual("In progress");
  });
});