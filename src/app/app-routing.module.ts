import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { AdminGuard } from './admin.guard';
import { AuthGuard } from './auth.guard';

//const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
//const redirectLoggedInToHome = () => redirectLoggedInTo(['documents']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    //...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'adminlogin',
    loadChildren: () => import('./adminlogin/adminlogin.module').then( m => m.AdminloginPageModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard] // Use a guard to protect student routes
  },
  {
    path: 'documents',
    loadChildren: () => import('./documents/documents.module').then( m => m.DocumentsPageModule),
    canActivate: [AuthGuard] // Use a guard to protect student routes

  },
  {
    path: 'admindocu',
    loadChildren: () => import('./admindocu/admindocu.module').then( m => m.AdmindocuPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'form',
    loadChildren: () => import('./form/form.module').then( m => m.FormPageModule),
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule),
  },
  {
    path: 'tester',
    loadChildren: () => import('./tester/tester.module').then( m => m.TesterPageModule),
  },
  {
    path: 'adminmenu',
    loadChildren: () => import('./adminmenu/adminmenu.module').then( m => m.AdminmenuPageModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'storage',
    loadChildren: () => import('./storage/storage.module').then( m => m.StoragePageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'storage-menu',
    loadChildren: () => import('./storage-menu/storage-menu.module').then( m => m.StorageMenuPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'esc',
    loadChildren: () => import('./esc/esc.module').then( m => m.EscPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'goodmoral',
    loadChildren: () => import('./goodmoral/goodmoral.module').then( m => m.GoodmoralPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'transcript',
    loadChildren: () => import('./transcript/transcript.module').then( m => m.TranscriptPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'ranking',
    loadChildren: () => import('./ranking/ranking.module').then( m => m.RankingPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'enrollment',
    loadChildren: () => import('./enrollment/enrollment.module').then( m => m.EnrollmentPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'cemi',
    loadChildren: () => import('./cemi/cemi.module').then( m => m.CemiPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'completion',
    loadChildren: () => import('./completion/completion.module').then( m => m.CompletionPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },
  {
    path: 'resetpass',
    loadChildren: () => import('./resetpass/resetpass.module').then( m => m.ResetpassPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module').then( m => m.CalendarPageModule),
    canActivate: [AdminGuard] // Use a guard to protect admin routes
  },  {
    path: 'schedule',
    loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'adminprofile',
    loadChildren: () => import('./adminprofile/adminprofile.module').then( m => m.AdminprofilePageModule)
  },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
