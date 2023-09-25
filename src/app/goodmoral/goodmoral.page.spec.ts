import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoodmoralPage } from './goodmoral.page';

describe('GoodmoralPage', () => {
  let component: GoodmoralPage;
  let fixture: ComponentFixture<GoodmoralPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GoodmoralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
