import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelFileManagerComponent } from './left-panel-file-manager.component';

describe('LeftPanelFileManagerComponent', () => {
  let component: LeftPanelFileManagerComponent;
  let fixture: ComponentFixture<LeftPanelFileManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeftPanelFileManagerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelFileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
