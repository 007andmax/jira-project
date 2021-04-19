import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesAsideNetworkTabComponent } from './company-devices-aside-network-tab.component';

describe('CompanyDevicesAsideNetworkTabComponent', () => {
  let component: CompanyDevicesAsideNetworkTabComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideNetworkTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesAsideNetworkTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesAsideNetworkTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
