import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCheckUseComponent } from './users-check-use.component';

describe('UsersCheckUseComponent', () => {
  let component: UsersCheckUseComponent;
  let fixture: ComponentFixture<UsersCheckUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersCheckUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCheckUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
