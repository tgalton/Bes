import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonToolbar, IonTitle, IonHeader, ]
})
export class HeaderComponent {
  title = 'Error Title'; // Titre par défaut

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getActiveRoute(this.activatedRoute)),
      map(route => route.snapshot.data['title'] || 'Default Title')
    ).subscribe(title => this.title = title);
  }

  private getActiveRoute(activatedRoute: ActivatedRoute): ActivatedRoute {
    let route = activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
