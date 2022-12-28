import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNetworkScanNoExistDevicesComponent } from './company-network-scan-no-exist-devices.component';

describe('CompanyNetworkScanNoExistDevicesComponent', () => {
  let component: CompanyNetworkScanNoExistDevicesComponent;
  let fixture: ComponentFixture<CompanyNetworkScanNoExistDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyNetworkScanNoExistDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyNetworkScanNoExistDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
