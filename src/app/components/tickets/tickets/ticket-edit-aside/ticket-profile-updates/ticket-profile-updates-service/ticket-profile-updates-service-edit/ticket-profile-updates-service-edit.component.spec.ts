import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesServiceEditComponent } from './ticket-profile-updates-service-edit.component';

describe('TicketProfileUpdatesServiceEditComponent', () => {
  let component: TicketProfileUpdatesServiceEditComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesServiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesServiceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesServiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
