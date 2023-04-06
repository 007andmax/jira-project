import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareProcessorComponent } from './hardware-processor.component';

describe('HardwareProcessorComponent', () => {
  let component: HardwareProcessorComponent;
  let fixture: ComponentFixture<HardwareProcessorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareProcessorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
