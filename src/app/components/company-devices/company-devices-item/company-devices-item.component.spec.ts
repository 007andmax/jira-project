import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesItemComponent } from './company-devices-item.component';

describe('CompanyDevicesItemComponent', () => {
  let component: CompanyDevicesItemComponent;
  let fixture: ComponentFixture<CompanyDevicesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
