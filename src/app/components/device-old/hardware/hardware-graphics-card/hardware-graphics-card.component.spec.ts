import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareGraphicsCardComponent } from './hardware-graphics-card.component';

describe('HardwareGraphicsCardComponent', () => {
  let component: HardwareGraphicsCardComponent;
  let fixture: ComponentFixture<HardwareGraphicsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareGraphicsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareGraphicsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
