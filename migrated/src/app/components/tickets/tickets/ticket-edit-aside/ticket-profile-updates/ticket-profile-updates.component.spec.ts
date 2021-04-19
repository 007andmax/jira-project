import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesComponent } from './ticket-profile-updates.component';

describe('TicketProfileUpdatesComponent', () => {
  let component: TicketProfileUpdatesComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
