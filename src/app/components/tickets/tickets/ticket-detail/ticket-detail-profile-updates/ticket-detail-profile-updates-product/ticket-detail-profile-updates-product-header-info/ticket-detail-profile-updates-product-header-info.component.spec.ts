import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesProductHeaderInfoComponent } from './ticketdetailprofileupdatesproductheaderinfo.component';

describe('TicketDetailProfileUpdatesProductHeaderInfoComponent', () => {
  let component: TicketDetailProfileUpdatesProductHeaderInfoComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesProductHeaderInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesProductHeaderInfoComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductHeaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
