import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesComponent } from './company-devices.component';

describe('CompanyDevicesComponent', () => {
  let component: CompanyDevicesComponent;
  let fixture: ComponentFixture<CompanyDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
