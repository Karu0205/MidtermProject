import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollmentPage } from './enrollment.page';

describe('EnrollmentPage', () => {
  let component: EnrollmentPage;
  let fixture: ComponentFixture<EnrollmentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EnrollmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
