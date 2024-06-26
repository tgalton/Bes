import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Hearth } from 'src/app/models/hearth';
import { HearthLineComponent } from 'src/app/shared/hearth-line/hearth-line.component';

@Component({
  selector: 'app-select-hearth-modal',
  templateUrl: './select-hearth-modal.component.html',
  styleUrls: ['./select-hearth-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HearthLineComponent],
})
export class SelectHearthModalComponent {
  @Input() hearths: Hearth[] = [];

  constructor(private modalCtrl: ModalController) {}

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  selectHearth(hearth: Hearth) {
    this.modalCtrl.dismiss(hearth, 'select');
  }
}
