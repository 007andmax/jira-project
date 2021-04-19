import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesServiceInfoComponent } from './ticket-profile-updates-service-info.component';

describe('TicketProfileUpdatesServiceInfoComponent', () => {
  let component: TicketProfileUpdatesServiceInfoComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesServiceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesServiceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesServiceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
