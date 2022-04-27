import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelMarketingComponent } from './left-panel-marketing.component';

describe('LeftPanelMarketingComponent', () => {
  let component: LeftPanelMarketingComponent;
  let fixture: ComponentFixture<LeftPanelMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelMarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
