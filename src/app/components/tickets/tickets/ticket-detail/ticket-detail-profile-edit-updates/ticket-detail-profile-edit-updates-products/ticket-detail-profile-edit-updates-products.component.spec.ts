import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileEditUpdatesProductsComponent } from './ticket-detail-profile-edit-updates-products.component';

describe('TicketDetailProfileEditUpdatesProductsComponent', () => {
  let component: TicketDetailProfileEditUpdatesProductsComponent;
  let fixture: ComponentFixture<TicketDetailProfileEditUpdatesProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileEditUpdatesProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
