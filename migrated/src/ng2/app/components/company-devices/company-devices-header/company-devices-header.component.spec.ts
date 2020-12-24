import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesHeaderComponent } from './company-devices-header.component';

describe('CompanyDevicesHeaderComponent', () => {
  let component: CompanyDevicesHeaderComponent;
  let fixture: ComponentFixture<CompanyDevicesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
