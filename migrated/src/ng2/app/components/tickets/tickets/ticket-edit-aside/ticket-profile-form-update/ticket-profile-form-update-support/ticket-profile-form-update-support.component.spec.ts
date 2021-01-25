import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileFormUpdateSupportComponent } from './ticket-profile-form-update-support.component';

describe('TicketProfileFormUpdateSupportComponent', () => {
  let component: TicketProfileFormUpdateSupportComponent;
  let fixture: ComponentFixture<TicketProfileFormUpdateSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileFormUpdateSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileFormUpdateSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
