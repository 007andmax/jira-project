import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementAddFileComponent } from './file-management-add-file.component';

describe('FileManagementAddFileComponent', () => {
  let component: FileManagementAddFileComponent;
  let fixture: ComponentFixture<FileManagementAddFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementAddFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementAddFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
