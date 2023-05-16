import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareHeaderComponent } from './hardware-header.component';

describe('HardwareHeaderComponent', () => {
  let component: HardwareHeaderComponent;
  let fixture: ComponentFixture<HardwareHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
