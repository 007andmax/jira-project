import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTicketStatusComponent } from './edit-ticket-status.component';

describe('EditTicketStatusComponent', () => {
  let component: EditTicketStatusComponent;
  let fixture: ComponentFixture<EditTicketStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTicketStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTicketStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
