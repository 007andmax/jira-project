import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDashTagsComponent } from './company-dash-tags.component';

describe('CompanyDashTagsComponent', () => {
  let component: CompanyDashTagsComponent;
  let fixture: ComponentFixture<CompanyDashTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDashTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDashTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
