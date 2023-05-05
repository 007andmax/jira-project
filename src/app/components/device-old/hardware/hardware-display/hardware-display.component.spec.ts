import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareDisplayComponent } from './hardware-display.component';

describe('HardwareDisplayComponent', () => {
  let component: HardwareDisplayComponent;
  let fixture: ComponentFixture<HardwareDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
