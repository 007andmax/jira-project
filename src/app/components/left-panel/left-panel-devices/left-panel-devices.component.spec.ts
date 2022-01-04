import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelDevicesComponent } from './left-panel-devices.component';

describe('LeftPanelDevicesComponent', () => {
  let component: LeftPanelDevicesComponent;
  let fixture: ComponentFixture<LeftPanelDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
