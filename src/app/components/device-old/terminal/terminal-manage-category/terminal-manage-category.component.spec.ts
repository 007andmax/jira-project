import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalManageCategoryComponent } from './terminal-manage-category.component';

describe('TerminalManageCategoryComponent', () => {
  let component: TerminalManageCategoryComponent;
  let fixture: ComponentFixture<TerminalManageCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalManageCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalManageCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
