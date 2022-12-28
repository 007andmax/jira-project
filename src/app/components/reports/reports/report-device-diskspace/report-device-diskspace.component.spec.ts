import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDeviceDiskspaceComponent } from './report-device-diskspace.component';

describe('ReportDeviceDiskspaceComponent', () => {
  let component: ReportDeviceDiskspaceComponent;
  let fixture: ComponentFixture<ReportDeviceDiskspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDeviceDiskspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDeviceDiskspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
