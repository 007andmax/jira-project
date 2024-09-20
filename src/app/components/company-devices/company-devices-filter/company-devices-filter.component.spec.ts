import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesFilterComponent } from './company-devices-filter.component';

describe('CompanyDevicesFilterComponent', () => {
  let component: CompanyDevicesFilterComponent;
  let fixture: ComponentFixture<CompanyDevicesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
