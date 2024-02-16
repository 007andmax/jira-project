import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFilterSaveComponent } from './user-filter-save.component';

describe('UserFilterSaveComponent', () => {
  let component: UserFilterSaveComponent;
  let fixture: ComponentFixture<UserFilterSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFilterSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFilterSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
