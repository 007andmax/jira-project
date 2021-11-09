import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAdapterReportComponent } from './network-adapter-report.component';

describe('NetworkAdapterReportComponent', () => {
  let component: NetworkAdapterReportComponent;
  let fixture: ComponentFixture<NetworkAdapterReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkAdapterReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAdapterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
