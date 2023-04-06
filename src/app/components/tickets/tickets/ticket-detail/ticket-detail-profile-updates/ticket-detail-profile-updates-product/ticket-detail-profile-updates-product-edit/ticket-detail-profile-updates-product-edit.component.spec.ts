import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesProductEditComponent } from './ticket-detail-profile-updates-product-edit.component';

describe('TicketDetailProfileUpdatesProductEditComponent', () => {
  let component: TicketDetailProfileUpdatesProductEditComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesProductEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesProductEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
