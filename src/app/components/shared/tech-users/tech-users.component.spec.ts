import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechUsersComponent } from './tech-users.component';

describe('TechUsersComponent', () => {
  let component: TechUsersComponent;
  let fixture: ComponentFixture<TechUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TechUsersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
