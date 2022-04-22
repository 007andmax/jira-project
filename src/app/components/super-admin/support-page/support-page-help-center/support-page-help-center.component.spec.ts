import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPageHelpCenterComponent } from './support-page-help-center.component';

describe('SupportPageHelpCenterComponent', () => {
  let component: SupportPageHelpCenterComponent;
  let fixture: ComponentFixture<SupportPageHelpCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPageHelpCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageHelpCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
