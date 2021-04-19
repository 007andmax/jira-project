import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAreaProgressComponent } from './upload-area-progress.component';

describe('UploadAreaProgressComponent', () => {
  let component: UploadAreaProgressComponent;
  let fixture: ComponentFixture<UploadAreaProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadAreaProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAreaProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
