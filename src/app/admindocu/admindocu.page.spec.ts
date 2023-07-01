import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmindocuPage } from './admindocu.page';

describe('AdmindocuPage', () => {
  let component: AdmindocuPage;
  let fixture: ComponentFixture<AdmindocuPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdmindocuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
