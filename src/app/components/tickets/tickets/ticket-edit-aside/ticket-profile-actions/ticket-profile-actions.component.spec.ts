import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileActionsComponent } from './ticket-profile-actions.component';

describe('TicketProfileActionsComponent', () => {
  let component: TicketProfileActionsComponent;
  let fixture: ComponentFixture<TicketProfileActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
