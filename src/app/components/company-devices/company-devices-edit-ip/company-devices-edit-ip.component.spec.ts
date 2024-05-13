import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesEditIpComponent } from './company-devices-edit-ip.component';

describe('CompanyDevicesEditIpComponent', () => {
  let component: CompanyDevicesEditIpComponent;
  let fixture: ComponentFixture<CompanyDevicesEditIpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesEditIpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesEditIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
