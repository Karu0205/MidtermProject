import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountReqPage } from './account-req.page';

describe('AccountReqPage', () => {
  let component: AccountReqPage;
  let fixture: ComponentFixture<AccountReqPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AccountReqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
