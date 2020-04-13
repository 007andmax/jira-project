import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEditAsideDevicesComponent } from './ticket-edit-aside-devices.component';

describe('TicketEditAsideDevicesComponent', () => {
  let component: TicketEditAsideDevicesComponent;
  let fixture: ComponentFixture<TicketEditAsideDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketEditAsideDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketEditAsideDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
