import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
// import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, settingsOutline } from 'ionicons/icons';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Hearth } from 'src/app/models/hearth';
import { AvatarService } from 'src/app/services/avatar.service';
import { HearthService } from 'src/app/services/hearth.service';
import { HearthEditModaleComponent } from './hearth-edit-modale/hearth-edit-modale.component';
import { InvitationModalComponent } from './invitation-modal/invitation-modal.component';

@Component({
  selector: 'app-hearth-line',
  templateUrl: './hearth-line.component.html',
  styleUrls: ['./hearth-line.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HearthLineComponent implements OnInit {
  @Input() hearth!: Hearth;
  imagePath$!: Observable<string>;

  constructor(
    protected avatarService: AvatarService,
    private hearthService: HearthService,
    private modalCtrl: ModalController
  ) {
    addIcons({ addOutline, settingsOutline });
  }

  async openInviteModal() {
    // Souscrire Observable pour obtenir le lien avant de créer la modale
    this.generateInvitationLink().subscribe(async (link) => {
      const modal = await this.modalCtrl.create({
        component: InvitationModalComponent,
        componentProps: { invitationLink: link },
      });

      modal.onDidDismiss().then((result) => {
        console.log('Modal dismissed with result:', result);
      });

      await modal.present();
    });
  }

  async openEditHeathModal() {
    const modal = await this.modalCtrl.create({
      component: HearthEditModaleComponent,
      componentProps: { hearth: this.hearth! },
    });
    await modal.present();
  }

  ngOnInit() {
    this.avatarService.getAllHearthImage().subscribe(() => {
      this.loadImages(this.hearth.imageName);
    });
  }

  loadImages(imageName: string) {
    this.imagePath$ = this.getImagePath(imageName);
  }

  // TODO: refacto ce code
  getImagePath(imageName: string | undefined): Observable<string> {
    if (!imageName) {
      return of('assets/hearth-images/defaultHouse.png');
    }
    return this.avatarService.getHearthImageByName(imageName).pipe(
      tap((imagePath) => console.log(imagePath)),
      catchError((error) => {
        console.error('Error retrieving avatar:', error);
        return of('assets/hearth-images/defaultHouse.png');
      })
    );
  }

  generateInvitationLink(): Observable<string> {
    return this.hearthService.sendHeartInvite(this.hearth.id.toString()).pipe(
      tap((response) => console.log('Response before mapping:', response)),
      map((response) => {
        const invitationLink = `http://localhost:4200/invitation?token=${response.token}`;
        console.log('Invitation link:', invitationLink);
        return invitationLink;
      }),
      tap((invitationLink) =>
        console.log('Final invitation link:', invitationLink)
      )
    );
  }
}
