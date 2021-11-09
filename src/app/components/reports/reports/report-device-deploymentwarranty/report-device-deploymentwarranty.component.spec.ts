import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDeviceDeploymentwarrantyComponent } from './report-device-deploymentwarranty.component';

describe('ReportDeviceDeploymentwarrantyComponent', () => {
  let component: ReportDeviceDeploymentwarrantyComponent;
  let fixture: ComponentFixture<ReportDeviceDeploymentwarrantyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDeviceDeploymentwarrantyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDeviceDeploymentwarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
