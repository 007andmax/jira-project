import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TehUsersComponent } from './teh-users.component';

describe('TehUsersComponent', () => {
  let component: TehUsersComponent;
  let fixture: ComponentFixture<TehUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TehUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TehUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
