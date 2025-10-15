import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { TaskHeaderAddTypeComponent } from '../../task-header-add/task-header-add-type/task-header-add-type.component';
import { TasksAddAssignedUsersComponent } from './tasks-add-assigned-users.component';


describe('TasksAddAssignedUsersComponent unit test', () => {
  let component: TasksAddAssignedUsersComponent;
  let fixture: ComponentFixture<TasksAddAssignedUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        CommonModule,
        FormsModule,
        DropDownModule,
        MatFormFieldModule,
        MatChipListModule,
        DynamicTooltipModule,
        MatChipModule,
        NgbModules
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TaskHeaderAddTypeComponent
      ]
    }).compileComponents();

  });

  it('check "toggleItem"', () => {
    const fixture = TestBed.createComponent(TaskHeaderAddTypeComponent);
    const com = fixture.debugElement.componentInstance;
    com.toggleItem({ id: 1 });
    expect(com.selectedTag).toEqual([{ id: 1 }]);
  });

});