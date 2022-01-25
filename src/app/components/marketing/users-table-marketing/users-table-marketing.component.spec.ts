import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableMarketingComponent } from './users-table-marketing.component';

describe('UsersTableMarketingComponent', () => {
  let component: UsersTableMarketingComponent;
  let fixture: ComponentFixture<UsersTableMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersTableMarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersTableMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
