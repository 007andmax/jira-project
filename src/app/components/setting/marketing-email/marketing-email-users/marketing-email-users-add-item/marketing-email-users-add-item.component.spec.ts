import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingEmailUsersAddItemComponent } from './marketing-email-users-add-item.component';

describe('MarketingEmailUsersAddItemComponent', () => {
  let component: MarketingEmailUsersAddItemComponent;
  let fixture: ComponentFixture<MarketingEmailUsersAddItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketingEmailUsersAddItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingEmailUsersAddItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
