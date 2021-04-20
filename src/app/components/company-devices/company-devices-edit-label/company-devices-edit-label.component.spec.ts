import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesEditLabelComponent } from './company-devices-edit-label.component';

describe('CompanyDevicesEditLabelComponent', () => {
  let component: CompanyDevicesEditLabelComponent;
  let fixture: ComponentFixture<CompanyDevicesEditLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesEditLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesEditLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
