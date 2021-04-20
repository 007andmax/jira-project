import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesAsideSystemComponent } from './company-devices-aside-system.component';

describe('CompanyDevicesAsideSystemComponent', () => {
  let component: CompanyDevicesAsideSystemComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesAsideSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesAsideSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
