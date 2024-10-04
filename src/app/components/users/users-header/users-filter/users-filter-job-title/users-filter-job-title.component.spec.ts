import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFilterJobTitleComponent } from './users-filter-job-title.component';

describe('UsersFilterJobTitleComponent', () => {
  let component: UsersFilterJobTitleComponent;
  let fixture: ComponentFixture<UsersFilterJobTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersFilterJobTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFilterJobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
