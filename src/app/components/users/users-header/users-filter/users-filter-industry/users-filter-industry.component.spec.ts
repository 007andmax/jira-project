import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFilterIndustryComponent } from './users-filter-industry.component';

describe('UsersFilterIndustryComponent', () => {
  let component: UsersFilterIndustryComponent;
  let fixture: ComponentFixture<UsersFilterIndustryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersFilterIndustryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFilterIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
