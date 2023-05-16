import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareHardDiskComponent } from './hardware-hard-disk.component';

describe('HardwareHardDiskComponent', () => {
  let component: HardwareHardDiskComponent;
  let fixture: ComponentFixture<HardwareHardDiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareHardDiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareHardDiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
