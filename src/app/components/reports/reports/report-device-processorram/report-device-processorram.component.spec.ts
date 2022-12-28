import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDeviceProcessorramComponent } from './report-device-processorram.component';

describe('ReportDeviceProcessorramComponent', () => {
  let component: ReportDeviceProcessorramComponent;
  let fixture: ComponentFixture<ReportDeviceProcessorramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDeviceProcessorramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDeviceProcessorramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
