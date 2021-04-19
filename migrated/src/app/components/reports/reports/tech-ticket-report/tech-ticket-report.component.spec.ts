import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechTicketReportComponent } from './tech-ticket-report.component';

describe('TechTicketReportComponent', () => {
  let component: TechTicketReportComponent;
  let fixture: ComponentFixture<TechTicketReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechTicketReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechTicketReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
