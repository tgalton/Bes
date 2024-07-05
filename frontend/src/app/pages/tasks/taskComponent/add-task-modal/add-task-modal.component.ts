import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
  imports: [IonicModule, ReactiveFormsModule, FormsModule, CommonModule],
  standalone: true,
})
export class AddTaskModalComponent {
  taskForm: FormGroup;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }

  // Méthode pour fermer la modale
  dismiss() {
    this.modalCtrl.dismiss();
  }

  // Méthode pour soumettre le formulaire
  submit() {
    if (this.taskForm.valid) {
      this.modalCtrl.dismiss(this.taskForm.value, 'submit');
    }
  }
}
