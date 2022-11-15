import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTagsAddComponent } from './manage-tags-add.component';

describe('ManageTagsAddComponent', () => {
  let component: ManageTagsAddComponent;
  let fixture: ComponentFixture<ManageTagsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTagsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTagsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
