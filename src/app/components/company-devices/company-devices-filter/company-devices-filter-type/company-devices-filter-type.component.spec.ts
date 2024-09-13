import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesFilterTypeComponent } from './company-devices-filter-type.component';

describe('CompanyDevicesFilterTypeComponent', () => {
  let component: CompanyDevicesFilterTypeComponent;
  let fixture: ComponentFixture<CompanyDevicesFilterTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesFilterTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesFilterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
