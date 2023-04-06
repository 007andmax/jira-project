import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailPasswordsComponent } from './ticket-detail-passwords.component';

describe('TicketDetailPasswordsComponent', () => {
  let component: TicketDetailPasswordsComponent;
  let fixture: ComponentFixture<TicketDetailPasswordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailPasswordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailPasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
