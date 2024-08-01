import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementFileInfoTagsComponent } from './file-management-file-info-tags.component';

describe('FileManagementFileInfoTagsComponent', () => {
  let component: FileManagementFileInfoTagsComponent;
  let fixture: ComponentFixture<FileManagementFileInfoTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementFileInfoTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementFileInfoTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
