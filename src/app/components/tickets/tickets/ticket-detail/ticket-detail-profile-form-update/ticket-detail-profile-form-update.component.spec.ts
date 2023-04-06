import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileFormUpdateComponent } from './ticket-detail-profile-form-update.component';

describe('TicketDetailProfileFormUpdateComponent', () => {
  let component: TicketDetailProfileFormUpdateComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileFormUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileFormUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
