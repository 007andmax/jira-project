import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFilterInfoComponent } from './users-filter-info.component';

describe('UsersFilterInfoComponent', () => {
  let component: UsersFilterInfoComponent;
  let fixture: ComponentFixture<UsersFilterInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersFilterInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFilterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
