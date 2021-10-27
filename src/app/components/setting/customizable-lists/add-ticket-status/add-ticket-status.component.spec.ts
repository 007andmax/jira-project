import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTicketStatusComponent } from './add-ticket-status.component';

describe('AddTicketStatusComponent', () => {
  let component: AddTicketStatusComponent;
  let fixture: ComponentFixture<AddTicketStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTicketStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTicketStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
