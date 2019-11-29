import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideComponent } from './users-aside.component';

describe('UsersAsideComponent', () => {
  let component: UsersAsideComponent;
  let fixture: ComponentFixture<UsersAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
