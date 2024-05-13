import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesCustomAsideComponent } from './company-devices-custom-aside.component';

describe('CompanyDevicesCustomAsideComponent', () => {
  let component: CompanyDevicesCustomAsideComponent;
  let fixture: ComponentFixture<CompanyDevicesCustomAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesCustomAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesCustomAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
