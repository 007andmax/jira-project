import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { ManageCardsComponent } from './manage-cards.component';

describe('ManageCardsComponent unit test', () => {
  let component: ManageCardsComponent;
  let fixture: ComponentFixture<ManageCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ManageCardsComponent
      ]
    }).compileComponents();

  });


  it('check "setDefaultScoll"', () => {
    const fixture = TestBed.createComponent(ManageCardsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setDefaultScoll();
    expect(com.showPreloader).toEqual(true);
  });

});