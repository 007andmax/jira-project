import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileFormUpdateProductsComponent } from './ticket-detail-profile-form-update-products.component';

describe('TicketDetailProfileFormUpdateProductsComponent', () => {
  let component: TicketDetailProfileFormUpdateProductsComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileFormUpdateProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
