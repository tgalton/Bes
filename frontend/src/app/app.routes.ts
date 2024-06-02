import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
    data: { title: 'Accueil' },
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterComponent),
    data: { title: 'Enregistrement' },
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    data: { title: 'Connexion' },
  },

  {
    path: 'tabs',
    loadComponent: () =>
      import('./shared/tabs/tabs.component').then((m) => m.TabsComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'hearts',
        loadComponent: () =>
          import('./pages/hearth-list/hearth-list.page').then(
            (m) => m.HearthListComponent
          ),
        data: { title: 'Foyers' },
      },
      {
        path: 'tasktab',
        loadComponent: () =>
          import('./pages/tasks/tasks.page').then((m) => m.TasksPage),
        data: { title: 'Tâches' },
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account/account.page').then((m) => m.AccountPage),
        data: { title: 'Compte' },
      },
    ],
  },

  // Plutôt que les routes ci-dessous, on favorise un lazyloading via le loadcomponent
  // { path: 'forgot-password', component: ForgotPasswordComponent },
  // { path: 'hearts', component: HearthsComponent },
  // { path: 'account', component: AccountComponent },
  // { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
  // { path: 'hearts', component: HearthsComponent, canActivate: [AuthGuard] },
  // { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  // Tu peux ajouter d'autres routes ici si nécessaire
];
