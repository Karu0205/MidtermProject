import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorageMenuPage } from './storage-menu.page';

describe('StorageMenuPage', () => {
  let component: StorageMenuPage;
  let fixture: ComponentFixture<StorageMenuPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StorageMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
