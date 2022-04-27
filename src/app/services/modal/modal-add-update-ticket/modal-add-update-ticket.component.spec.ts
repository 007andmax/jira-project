import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddUpdateTicketComponent } from './modal-add-update-ticket.component';

describe('ModalAddUpdateTicketComponent', () => {
  let component: ModalAddUpdateTicketComponent;
  let fixture: ComponentFixture<ModalAddUpdateTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddUpdateTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddUpdateTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
