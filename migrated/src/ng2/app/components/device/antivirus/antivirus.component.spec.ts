import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntivirusComponent } from './antivirus.component';

describe('AntivirusComponent', () => {
  let component: AntivirusComponent;
  let fixture: ComponentFixture<AntivirusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntivirusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntivirusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
