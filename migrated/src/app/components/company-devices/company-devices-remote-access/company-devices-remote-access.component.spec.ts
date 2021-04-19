import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesRemoteAccessComponent } from './company-devices-remote-access.component';

describe('CompanyDevicesRemoteAccessComponent', () => {
  let component: CompanyDevicesRemoteAccessComponent;
  let fixture: ComponentFixture<CompanyDevicesRemoteAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesRemoteAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesRemoteAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
