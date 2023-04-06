import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareOperatingSystemComponent } from './hardware-operating-system.component';

describe('HardwareOperatingSystemComponent', () => {
  let component: HardwareOperatingSystemComponent;
  let fixture: ComponentFixture<HardwareOperatingSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareOperatingSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareOperatingSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
