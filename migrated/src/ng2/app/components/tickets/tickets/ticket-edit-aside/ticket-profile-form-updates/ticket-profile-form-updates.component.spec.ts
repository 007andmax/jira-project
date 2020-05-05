import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileFormUpdatesComponent } from './ticket-profile-form-updates.component';

describe('TicketProfileFormUpdatesComponent', () => {
  let component: TicketProfileFormUpdatesComponent;
  let fixture: ComponentFixture<TicketProfileFormUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileFormUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileFormUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
