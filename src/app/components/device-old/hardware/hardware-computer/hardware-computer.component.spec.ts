import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareComputerComponent } from './hardware-computer.component';

describe('HardwareComputerComponent', () => {
  let component: HardwareComputerComponent;
  let fixture: ComponentFixture<HardwareComputerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareComputerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareComputerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
