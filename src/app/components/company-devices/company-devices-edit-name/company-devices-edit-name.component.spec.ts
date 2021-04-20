import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesEditNameComponent } from './company-devices-edit-name.component';

describe('CompanyDevicesEditNameComponent', () => {
  let component: CompanyDevicesEditNameComponent;
  let fixture: ComponentFixture<CompanyDevicesEditNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesEditNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesEditNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
