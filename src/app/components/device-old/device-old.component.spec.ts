import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOldComponent } from './device-old.component';

describe('DeviceOldComponent', () => {
  let component: DeviceOldComponent;
  let fixture: ComponentFixture<DeviceOldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
