import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentmodalPage } from './studentmodal.page';

describe('StudentmodalPage', () => {
  let component: StudentmodalPage;
  let fixture: ComponentFixture<StudentmodalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StudentmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
