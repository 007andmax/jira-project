import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatErrorComponent } from './mat-error.component';

describe('MatErrorComponent', () => {
  let component: MatErrorComponent;
  let fixture: ComponentFixture<MatErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
