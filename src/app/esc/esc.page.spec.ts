import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscPage } from './esc.page';

describe('EscPage', () => {
  let component: EscPage;
  let fixture: ComponentFixture<EscPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EscPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
