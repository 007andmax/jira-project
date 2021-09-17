import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileEditFormUpdateProductsComponent } from './ticket-profile-edit-form-update-products.component';

describe('TicketProfileEditFormUpdateProductsComponent', () => {
  let component: TicketProfileEditFormUpdateProductsComponent;
  let fixture: ComponentFixture<TicketProfileEditFormUpdateProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileEditFormUpdateProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileEditFormUpdateProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
