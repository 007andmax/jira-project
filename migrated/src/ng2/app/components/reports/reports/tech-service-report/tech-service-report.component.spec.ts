import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechServiceReportComponent } from './tech-service-report.component';

describe('TechServiceReportComponent', () => {
  let component: TechServiceReportComponent;
  let fixture: ComponentFixture<TechServiceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechServiceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechServiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
