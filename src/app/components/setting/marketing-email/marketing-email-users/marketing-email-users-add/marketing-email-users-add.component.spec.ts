import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingEmailUsersAddComponent } from './marketing-email-users-add.component';

describe('MarketingEmailUsersAddComponent', () => {
  let component: MarketingEmailUsersAddComponent;
  let fixture: ComponentFixture<MarketingEmailUsersAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingEmailUsersAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingEmailUsersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
