import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDeviceWarrantyComponent } from './report-device-warranty.component';

describe('ReportDeviceWarrantyComponent', () => {
  let component: ReportDeviceWarrantyComponent;
  let fixture: ComponentFixture<ReportDeviceWarrantyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDeviceWarrantyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDeviceWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
