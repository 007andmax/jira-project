import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelPasswordManagerComponent } from './left-panel-password-manager.component';

describe('LeftPanelPasswordManagerComponent', () => {
  let component: LeftPanelPasswordManagerComponent;
  let fixture: ComponentFixture<LeftPanelPasswordManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelPasswordManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelPasswordManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
