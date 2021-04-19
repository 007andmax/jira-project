import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelCompaniesComponent } from './left-panel-companies.component';

describe('LeftPanelCompaniesComponent', () => {
  let component: LeftPanelCompaniesComponent;
  let fixture: ComponentFixture<LeftPanelCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
