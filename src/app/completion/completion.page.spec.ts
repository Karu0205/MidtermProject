import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletionPage } from './completion.page';

describe('CompletionPage', () => {
  let component: CompletionPage;
  let fixture: ComponentFixture<CompletionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompletionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
