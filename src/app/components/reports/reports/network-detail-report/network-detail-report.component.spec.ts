import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDetailReportComponent } from './network-detail-report.component';

describe('NetworkDetailReportComponent', () => {
  let component: NetworkDetailReportComponent;
  let fixture: ComponentFixture<NetworkDetailReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkDetailReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
