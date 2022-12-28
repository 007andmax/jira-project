import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkIpReportComponent } from './network-ip-report.component';

describe('NetworkIpReportComponent', () => {
  let component: NetworkIpReportComponent;
  let fixture: ComponentFixture<NetworkIpReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkIpReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkIpReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
