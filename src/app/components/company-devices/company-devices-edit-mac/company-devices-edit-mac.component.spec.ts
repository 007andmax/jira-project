import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesEditMacComponent } from './company-devices-edit-mac.component';

describe('CompanyDevicesEditMacComponent', () => {
  let component: CompanyDevicesEditMacComponent;
  let fixture: ComponentFixture<CompanyDevicesEditMacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesEditMacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesEditMacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
