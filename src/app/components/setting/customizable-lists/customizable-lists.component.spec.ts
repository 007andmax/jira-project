import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizableListsComponent } from './customizable-lists.component';

describe('CustomizableListsComponent', () => {
  let component: CustomizableListsComponent;
  let fixture: ComponentFixture<CustomizableListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizableListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizableListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
