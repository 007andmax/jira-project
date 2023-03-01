import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileFormUpdateSupportComponent } from './ticket-detail-profile-form-update-support.component';

describe('TicketDetailProfileFormUpdateSupportComponent', () => {
  let component: TicketDetailProfileFormUpdateSupportComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileFormUpdateSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileFormUpdateSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
