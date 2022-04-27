import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPageInfoTagsComponent } from './support-page-info-tags.component';

describe('SupportPageInfoTagsComponent', () => {
  let component: SupportPageInfoTagsComponent;
  let fixture: ComponentFixture<SupportPageInfoTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPageInfoTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageInfoTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
