import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MesasComponent } from './pages/mesas/mesas.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion.component';
import { CocinaComponent } from './pages/cocina/cocina.component';
import { CrudComponent } from './pages/crud/crud.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'mesas', component: MesasComponent, canActivate: [authGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
  { path: 'confirmacion', component: ConfirmacionComponent, canActivate: [authGuard] },
  { path: 'cocina', component: CocinaComponent, canActivate: [authGuard] },
  { path: 'crud', component: CrudComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
