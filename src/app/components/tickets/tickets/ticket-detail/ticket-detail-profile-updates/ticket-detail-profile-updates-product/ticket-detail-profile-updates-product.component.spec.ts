import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesProductComponent } from './ticket-detail-profile-updates-product.component';

describe('TicketDetailProfileUpdatesProductComponent', () => {
  let component: TicketDetailProfileUpdatesProductComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
