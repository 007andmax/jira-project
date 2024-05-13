import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesAssestTypeDropDownComponent } from './company-devices-assest-type-drop-down.component';

describe('CompanyDevicesAssestTypeDropDownComponent', () => {
  let component: CompanyDevicesAssestTypeDropDownComponent;
  let fixture: ComponentFixture<CompanyDevicesAssestTypeDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesAssestTypeDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesAssestTypeDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
