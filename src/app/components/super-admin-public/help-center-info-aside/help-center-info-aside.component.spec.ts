import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCenterInfoAsideComponent } from './help-center-info-aside.component';

describe('HelpCenterInfoAsideComponent', () => {
  let component: HelpCenterInfoAsideComponent;
  let fixture: ComponentFixture<HelpCenterInfoAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpCenterInfoAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCenterInfoAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
