import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesServiceItemComponent } from './ticket-profile-updates-service-item.component';

describe('TicketProfileUpdatesServiceItemComponent', () => {
  let component: TicketProfileUpdatesServiceItemComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesServiceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesServiceItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesServiceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
