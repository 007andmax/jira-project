import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerAddFileComponent } from './file-manager-add-file.component';

describe('FileManagerAddFileComponent', () => {
  let component: FileManagerAddFileComponent;
  let fixture: ComponentFixture<FileManagerAddFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerAddFileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerAddFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
