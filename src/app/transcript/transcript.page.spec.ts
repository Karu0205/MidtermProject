import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranscriptPage } from './transcript.page';

describe('TranscriptPage', () => {
  let component: TranscriptPage;
  let fixture: ComponentFixture<TranscriptPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TranscriptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
