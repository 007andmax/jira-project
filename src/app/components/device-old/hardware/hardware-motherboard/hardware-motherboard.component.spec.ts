import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareMotherboardComponent } from './hardware-motherboard.component';

describe('HardwareMotherboardComponent', () => {
  let component: HardwareMotherboardComponent;
  let fixture: ComponentFixture<HardwareMotherboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareMotherboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareMotherboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
