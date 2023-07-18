import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

//const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
//const redirectLoggedInToHome = () => redirectLoggedInTo(['documents']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
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
    loadChildren: () => import('./adminlogin/adminlogin.module').then( m => m.AdminloginPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./documents/documents.module').then( m => m.DocumentsPageModule),
    //...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'admindocu',
    loadChildren: () => import('./admindocu/admindocu.module').then( m => m.AdmindocuPageModule)
  },
  {
    path: 'form',
    loadChildren: () => import('./form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'tester',
    loadChildren: () => import('./tester/tester.module').then( m => m.TesterPageModule)
  },
  {
    path: 'adminmenu',
    loadChildren: () => import('./adminmenu/adminmenu.module').then( m => m.AdminmenuPageModule)
  },  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
