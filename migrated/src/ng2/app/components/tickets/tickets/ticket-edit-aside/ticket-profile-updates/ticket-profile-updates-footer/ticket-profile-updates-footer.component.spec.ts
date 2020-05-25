import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesFooterComponent } from './ticket-profile-updates-footer.component';

describe('TicketProfileUpdatesFooterComponent', () => {
  let component: TicketProfileUpdatesFooterComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
