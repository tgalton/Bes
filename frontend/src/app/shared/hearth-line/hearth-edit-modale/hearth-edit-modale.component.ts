import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { AvatarService } from 'src/app/services/avatar.service';
import { HearthService } from 'src/app/services/hearth.service';

@Component({
  selector: 'app-hearth-edit-modale',
  templateUrl: './hearth-edit-modale.component.html',
  styleUrls: ['./hearth-edit-modale.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HearthEditModaleComponent implements OnInit, OnDestroy {
  hearthImages: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private avatarService: AvatarService,
    private cd: ChangeDetectorRef,
    private hearthService: HearthService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.avatarService.getAllAvatars().subscribe({
      next: (hearthsImages) => {
        this.hearthImages = hearthsImages;
        this.cd.detectChanges(); // Force Angular to recognize the update
      },
      error: (error) => {
        console.error('Failed to load avatars:', error);
      },
    });
  }

  updateHearth() {
    const hearthId = 1; // Obtenez l'ID d'un moyen quelconque, comme un paramètre de route
    const updates = { name: 'New Hearth Name', adminId: 2 };
    this.hearthService.updateHearthDetails(hearthId, updates).subscribe({
      next: (updatedHearth) => {
        console.log('Hearth updated!', updatedHearth);
      },
      error: (error) => {
        console.error('Failed to update hearth', error);
      },
    });
  }
}
