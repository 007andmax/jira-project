import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesProductItemComponent } from './ticket-detail-profile-updates-product-item.component';

describe('TicketDetailProfileUpdatesProductItemComponent', () => {
  let component: TicketDetailProfileUpdatesProductItemComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesProductItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesProductItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
