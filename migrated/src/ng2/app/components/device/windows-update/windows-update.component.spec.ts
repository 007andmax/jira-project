import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowsUpdateComponent } from './windows-update.component';

describe('WindowsUpdateComponent', () => {
  let component: WindowsUpdateComponent;
  let fixture: ComponentFixture<WindowsUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowsUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
