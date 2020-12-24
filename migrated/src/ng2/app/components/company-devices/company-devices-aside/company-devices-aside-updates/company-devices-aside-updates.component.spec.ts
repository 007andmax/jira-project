import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesAsideUpdatesComponent } from './company-devices-aside-updates.component';

describe('CompanyDevicesAsideUpdatesComponent', () => {
  let component: CompanyDevicesAsideUpdatesComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesAsideUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesAsideUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
