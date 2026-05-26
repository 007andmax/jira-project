import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { TicketPreviewReportServiceItemComponent } from './ticket-preview-report-service-item.component';
import { TicketPreviewService } from '../class/ticket-preview-service';


describe('TicketPreviewReportServiceItemComponent unit test', () => {
  let component: TicketPreviewReportServiceItemComponent;
  let fixture: ComponentFixture<TicketPreviewReportServiceItemComponent>;

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
      declarations: [TicketPreviewReportServiceItemComponent
      ]
    }).compileComponents();

  });
  it('check "onChangeDescription"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportServiceItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new TicketPreviewService();
    com.service.description = "";
    com.onChangeDescription({ target: { value: "test" } });
    expect(com.service.description).toEqual("test");
    expect(com.service.isEdit).toEqual(true);
  });
  it('check "getHours"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportServiceItemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getHours({ quantity: 1 })).toEqual(1)
  });
  it('check "getMinutes"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportServiceItemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getMinutes({ quantity: 1.5 })).toEqual(30)
  });
});