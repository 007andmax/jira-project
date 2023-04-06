import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailPasswordsItemComponent } from './ticket-detail-passwords-item.component';

describe('TicketDetailPasswordsItemComponent', () => {
  let component: TicketDetailPasswordsItemComponent;
  let fixture: ComponentFixture<TicketDetailPasswordsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailPasswordsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailPasswordsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
