import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatChipTagComponent } from './mat-chip-tag.component';

describe('MatChipTagComponent', () => {
  let component: MatChipTagComponent;
  let fixture: ComponentFixture<MatChipTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatChipTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatChipTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
