import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingEmailUsersItemComponent } from './marketing-email-users-item.component';

describe('MarketingEmailUsersItemComponent', () => {
  let component: MarketingEmailUsersItemComponent;
  let fixture: ComponentFixture<MarketingEmailUsersItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingEmailUsersItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingEmailUsersItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
