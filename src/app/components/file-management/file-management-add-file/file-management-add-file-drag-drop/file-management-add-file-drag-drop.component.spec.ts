import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementAddFileDragDropComponent } from './file-management-add-file-drag-drop.component';

describe('FileManagementAddFileDragDropComponent', () => {
  let component: FileManagementAddFileDragDropComponent;
  let fixture: ComponentFixture<FileManagementAddFileDragDropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementAddFileDragDropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementAddFileDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
