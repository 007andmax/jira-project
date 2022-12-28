import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDeviceAntivirusComponent } from './report-device-antivirus.component';

describe('ReportDeviceAntivirusComponent', () => {
  let component: ReportDeviceAntivirusComponent;
  let fixture: ComponentFixture<ReportDeviceAntivirusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDeviceAntivirusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDeviceAntivirusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
