import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CemiPage } from './cemi.page';

describe('CemiPage', () => {
  let component: CemiPage;
  let fixture: ComponentFixture<CemiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CemiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
