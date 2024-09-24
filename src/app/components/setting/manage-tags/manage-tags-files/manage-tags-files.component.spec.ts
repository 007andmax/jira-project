import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTagsFilesComponent } from './manage-tags-files.component';

describe('ManageTagsFilesComponent', () => {
  let component: ManageTagsFilesComponent;
  let fixture: ComponentFixture<ManageTagsFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTagsFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTagsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
