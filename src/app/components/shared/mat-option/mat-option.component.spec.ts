import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatOptionComponent } from './mat-option.component';

describe('MatOptionComponent', () => {
  let component: MatOptionComponent;
  let fixture: ComponentFixture<MatOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
