import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerItemFileComponent } from './file-manager-item-file.component';

describe('FileManagerItemFileComponent', () => {
  let component: FileManagerItemFileComponent;
  let fixture: ComponentFixture<FileManagerItemFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerItemFileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerItemFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
