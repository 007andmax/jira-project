import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileFormUpdateHeaderComponent } from './ticket-detail-profile-form-update-header.component';

describe('TicketDetailProfileFormUpdateHeaderComponent', () => {
  let component: TicketDetailProfileFormUpdateHeaderComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileFormUpdateHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileFormUpdateHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
