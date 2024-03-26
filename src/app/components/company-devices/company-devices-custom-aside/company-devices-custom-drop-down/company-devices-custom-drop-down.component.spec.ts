import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesCustomDropDownComponent } from './company-devices-custom-drop-down.component';

describe('CompanyDevicesCustomDropDownComponent', () => {
  let component: CompanyDevicesCustomDropDownComponent;
  let fixture: ComponentFixture<CompanyDevicesCustomDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesCustomDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesCustomDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
