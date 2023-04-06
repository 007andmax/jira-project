import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareNetworkCardComponent } from './hardware-network-card.component';

describe('HardwareNetworkCardComponent', () => {
  let component: HardwareNetworkCardComponent;
  let fixture: ComponentFixture<HardwareNetworkCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareNetworkCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareNetworkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
