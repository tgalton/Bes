import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.page.html',
  styleUrls: ['./invitation.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class InvitationPage implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        // Vérifiez si l'utilisateur est connecté
        const isAuthenticated = this.checkAuthentication();
        if (isAuthenticated) {
          // Utilisez le token pour accepter l'invitation
          this.acceptInvitation(token);
        } else {
          // Stockez le token dans le localStorage et redirigez vers la page de connexion
          localStorage.setItem('invitationToken', token);
          this.router.navigate(['/login']);
        }
      }
    });
  }

  checkAuthentication(): boolean {
    // Implémentez la logique pour vérifier si l'utilisateur est connecté
    return false; // Remplacez par votre logique d'authentification
  }

  acceptInvitation(token: string) {
    // Implémentez la logique pour accepter l'invitation avec le token
    console.log('Invitation accepted with token:', token);
  }
}
