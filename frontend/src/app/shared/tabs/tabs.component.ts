import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonTabs, IonIcon, IonTabButton, IonLabel, IonTabBar } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';

// Importation des icônes spécifiques
import { homeOutline, libraryOutline, personCircleOutline, add  } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [IonTabBar, IonLabel, IonTabButton, IonIcon, IonTabs]
})
export class TabsComponent {
  currentTab = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentTab = event.urlAfterRedirects;
      }
    });

    // Enregistrement des icônes
    addIcons({
      'home-outline': homeOutline,
      'library-outline': libraryOutline,
      'person-circle-outline': personCircleOutline,
      'add': add
    });
  }
}
