import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelTagsCompaniesComponent } from './left-panel-tags-companies.component';

describe('LeftPanelTagsCompaniesComponent', () => {
  let component: LeftPanelTagsCompaniesComponent;
  let fixture: ComponentFixture<LeftPanelTagsCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelTagsCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelTagsCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
