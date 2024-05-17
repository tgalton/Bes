import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import * as AuthActions from '../../store/actions/auth.actions'; // Update the path according to your structure

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonButtons, IonToolbar, IonTitle, IonHeader, IonButton, IonIcon],
})
export class HeaderComponent {
  title = 'Error Title'; // Default title

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store // Inject the store here
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getActiveRoute(this.activatedRoute)),
        map((route) => route.snapshot.data['title'] || 'Default Title')
      )
      .subscribe((title) => (this.title = title));
  }

  logout() {
    console.log('testDispatchLogout');
    this.store.dispatch(AuthActions.logout());
  }

  private getActiveRoute(activatedRoute: ActivatedRoute): ActivatedRoute {
    let route = activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
