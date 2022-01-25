import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingEmailUsersComponent } from './marketing-email-users.component';

describe('MarketingEmailUsersComponent', () => {
  let component: MarketingEmailUsersComponent;
  let fixture: ComponentFixture<MarketingEmailUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingEmailUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingEmailUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
