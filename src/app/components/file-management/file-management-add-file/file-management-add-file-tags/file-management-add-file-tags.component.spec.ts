import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementAddFileTagsComponent } from './file-management-add-file-tags.component';

describe('FileManagementAddFileTagsComponent', () => {
  let component: FileManagementAddFileTagsComponent;
  let fixture: ComponentFixture<FileManagementAddFileTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementAddFileTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementAddFileTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
