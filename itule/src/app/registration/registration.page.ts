import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  @ViewChild('pseudoInput', { static: true }) pseudoInput!: IonInput;
  @ViewChild('emailInput', { static: true }) emailInput!: IonInput;
  @ViewChild('pwdInput', { static: true }) pwdInput!: IonInput;

  constructor() {}

  ngOnInit() {}

  showErrors = false;
  // TODO TGA : Ajouter des messages d'erreurs.
  handleSubmit() {
    const pseudo = this.pseudoInput.value;
    const email = this.emailInput.value;
    const pwd = this.pwdInput.value;

    if (pseudo && email && pwd) {
      const validPseudoRegex = /^[a-zA-Z0-9_-]{5,20}$/; //Minimum 5 et maximum 20 caractères
      const validEmailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i; // vérifie le format email
      const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; //Minimum 8 caractères, au moins une lettre et un chiffre

      const isAllInputValid =
        validPseudoRegex.test(pseudo.toString()) &&
        validEmailRegex.test(email.toString()) &&
        validPasswordRegex.test(pwd.toString());

      if (!isAllInputValid) {
        this.showErrors = true;
      }
    }
  }
}
