import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPageHeaderComponent } from './support-page-header.component';

describe('SupportPageHeaderComponent', () => {
  let component: SupportPageHeaderComponent;
  let fixture: ComponentFixture<SupportPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
