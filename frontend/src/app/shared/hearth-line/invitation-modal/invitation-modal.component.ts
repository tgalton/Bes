import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { clipboardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-invitational-modal',
  templateUrl: './invitation-modal.component.html',
  styleUrls: ['./invitation-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class InvitationModalComponent {
  @Input() invitationLink!: string;

  constructor() {
    addIcons({ clipboardOutline });
  }

  copyLinkToClipboard() {
    navigator.clipboard.writeText(this.invitationLink).then(() => {
      // Inform the user that the action took place (Toast or Alert)
      console.log('Copied to clipboard!');
    });
  }
}
