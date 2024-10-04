import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFilterTagsComponent } from './users-filter-tags.component';

describe('UsersFilterTagsComponent', () => {
  let component: UsersFilterTagsComponent;
  let fixture: ComponentFixture<UsersFilterTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersFilterTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFilterTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
