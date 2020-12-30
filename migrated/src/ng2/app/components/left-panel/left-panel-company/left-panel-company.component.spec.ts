import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelCompanyComponent } from './left-panel-company.component';

describe('LeftPanelCompanyComponent', () => {
  let component: LeftPanelCompanyComponent;
  let fixture: ComponentFixture<LeftPanelCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
