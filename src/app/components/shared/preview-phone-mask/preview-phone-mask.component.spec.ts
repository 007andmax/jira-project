import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPhoneMaskComponent } from './preview-phone-mask.component';

describe('PreviewPhoneMaskComponent', () => {
  let component: PreviewPhoneMaskComponent;
  let fixture: ComponentFixture<PreviewPhoneMaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewPhoneMaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPhoneMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
