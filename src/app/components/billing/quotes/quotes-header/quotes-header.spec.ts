import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { QuotesHeaderComponent } from './quotes-header.component';


describe('QuotesHeaderComponent unit test', () => {
  let component: QuotesHeaderComponent;
  let fixture: ComponentFixture<QuotesHeaderComponent>;

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
        NoopAnimationsModule, QuotesHeaderComponent],
}).compileComponents();

  });
  it('check "getSelectedCount"', () => {
    const fixture = TestBed.createComponent(QuotesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.quotes = [{ selected: true, isOrder: true }, { selected: true, isOrder: false }];
    expect(com.getSelectedCount()).toEqual(2);
    com.quotes = [{ selected: true, isOrder: true }, { selected: true, isOrder: true }];
    expect(com.getSelectedCount()).toEqual(2);
  });
  it('check "getTextCountFilters"', () => {
    const fixture = TestBed.createComponent(QuotesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.countFilter = 7;
    expect(com.getTextCountFilters()).toEqual(`Filters (7)`);
  });
  it('check "onChangeCountFilter"', () => {
    const fixture = TestBed.createComponent(QuotesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeCountFilter(8)
    expect(com.countFilter).toEqual(8);
  });
});