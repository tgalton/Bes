import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, settingsOutline } from 'ionicons/icons';
import { Observable, catchError, of, tap } from 'rxjs';
import { Hearth } from 'src/app/models/hearth';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-hearth-line',
  templateUrl: './hearth-line.component.html',
  styleUrls: ['./hearth-line.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, CommonModule],
})
export class HearthLineComponent implements OnInit {
  @Input() hearth!: Hearth;
  imagePath$!: Observable<string>;

  constructor(protected avatarService: AvatarService) {
    addIcons({ addOutline, settingsOutline });
  }

  ngOnInit() {
    this.avatarService.getAllHearthImage().subscribe(() => {
      // Assurez-vous que les données sont là avant de continuer
      this.loadImages(this.hearth.imageName);
    });
  }

  loadImages(imageName: string) {
    this.imagePath$ = this.getImagePath(imageName);
  }

  getImagePath(imageName: string | undefined): Observable<string> {
    if (!imageName) {
      return of('path/to/default/icon.jpg'); // TODO: Replace with actual path
    }
    console.log(imageName);
    return this.avatarService.getHearthImageByName(imageName).pipe(
      tap((imagePath) => console.log(imagePath)),
      catchError((error) => {
        console.error('Error retrieving avatar:', error);
        return of('path/to/error/icon.jpg'); // TODO: Replace with actual error path
      })
    );
  }
}
