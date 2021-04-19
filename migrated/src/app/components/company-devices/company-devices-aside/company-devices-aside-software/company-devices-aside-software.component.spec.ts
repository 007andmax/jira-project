import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesAsideSoftwareComponent } from './company-devices-aside-software.component';

describe('CompanyDevicesAsideSoftwareComponent', () => {
  let component: CompanyDevicesAsideSoftwareComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesAsideSoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesAsideSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
