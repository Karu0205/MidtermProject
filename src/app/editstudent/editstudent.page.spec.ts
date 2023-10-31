import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditstudentPage } from './editstudent.page';

describe('EditstudentPage', () => {
  let component: EditstudentPage;
  let fixture: ComponentFixture<EditstudentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditstudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
