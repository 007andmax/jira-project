import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesProductEditComponent } from './ticket-profile-updates-product-edit.component';

describe('TicketProfileUpdatesProductEditComponent', () => {
  let component: TicketProfileUpdatesProductEditComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesProductEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesProductEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
