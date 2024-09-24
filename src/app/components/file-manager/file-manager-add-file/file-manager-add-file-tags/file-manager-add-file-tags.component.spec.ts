import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerAddFileTagsComponent } from './file-manager-add-file-tags.component';

describe('FileManagerAddFileTagsComponent', () => {
  let component: FileManagerAddFileTagsComponent;
  let fixture: ComponentFixture<FileManagerAddFileTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerAddFileTagsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerAddFileTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
