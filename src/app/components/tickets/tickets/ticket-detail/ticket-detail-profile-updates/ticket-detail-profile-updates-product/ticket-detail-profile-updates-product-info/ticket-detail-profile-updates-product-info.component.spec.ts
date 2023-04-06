import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesProductInfoComponent } from './ticket-detail-profile-updates-product-info.component';

describe('TicketDetailProfileUpdatesProductInfoComponent', () => {
  let component: TicketDetailProfileUpdatesProductInfoComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesProductInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesProductInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
