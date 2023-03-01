import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesServiceHeaderInfoComponent } from './ticketdetailprofileupdatesserviceheaderinfo.component';

describe('TicketDetailProfileUpdatesServiceHeaderInfoComponent', () => {
  let component: TicketDetailProfileUpdatesServiceHeaderInfoComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesServiceHeaderInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesServiceHeaderInfoComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesServiceHeaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
