import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileEditFormUpdateServicesComponent } from './ticket-profile-edit-form-update-services.component';

describe('TicketProfileEditFormUpdateServicesComponent', () => {
  let component: TicketProfileEditFormUpdateServicesComponent;
  let fixture: ComponentFixture<TicketProfileEditFormUpdateServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileEditFormUpdateServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileEditFormUpdateServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
