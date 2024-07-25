import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementItemFileComponent } from './file-management-item-file.component';

describe('FileManagementItemFileComponent', () => {
  let component: FileManagementItemFileComponent;
  let fixture: ComponentFixture<FileManagementItemFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementItemFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementItemFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
