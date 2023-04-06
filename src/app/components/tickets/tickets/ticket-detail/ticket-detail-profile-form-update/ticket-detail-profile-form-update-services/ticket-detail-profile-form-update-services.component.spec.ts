import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileFormUpdateServicesComponent } from './ticket-detail-profile-form-update-services.component';

describe('TicketDetailProfileFormUpdateServicesComponent', () => {
  let component: TicketDetailProfileFormUpdateServicesComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileFormUpdateServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileFormUpdateServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
