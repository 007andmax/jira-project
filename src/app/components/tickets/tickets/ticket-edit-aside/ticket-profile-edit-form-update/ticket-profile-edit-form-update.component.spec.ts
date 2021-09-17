import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileEditFormUpdateComponent } from './ticket-profile-edit-form-update.component';

describe('TicketProfileEditFormUpdateComponent', () => {
  let component: TicketProfileEditFormUpdateComponent;
  let fixture: ComponentFixture<TicketProfileEditFormUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileEditFormUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileEditFormUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
