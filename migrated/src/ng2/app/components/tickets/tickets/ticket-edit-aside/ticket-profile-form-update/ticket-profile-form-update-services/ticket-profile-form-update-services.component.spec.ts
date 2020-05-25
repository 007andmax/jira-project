import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileFormUpdateServicesComponent } from './ticket-profile-form-update-services.component';

describe('TicketProfileFormUpdateServicesComponent', () => {
  let component: TicketProfileFormUpdateServicesComponent;
  let fixture: ComponentFixture<TicketProfileFormUpdateServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileFormUpdateServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileFormUpdateServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
