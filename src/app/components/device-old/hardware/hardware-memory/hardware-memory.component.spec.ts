import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareMemoryComponent } from './hardware-memory.component';

describe('HardwareMemoryComponent', () => {
  let component: HardwareMemoryComponent;
  let fixture: ComponentFixture<HardwareMemoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareMemoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareMemoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
