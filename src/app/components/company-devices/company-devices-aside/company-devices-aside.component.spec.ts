import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesAsideComponent } from './company-devices-aside.component';

describe('CompanyDevicesAsideComponent', () => {
  let component: CompanyDevicesAsideComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
