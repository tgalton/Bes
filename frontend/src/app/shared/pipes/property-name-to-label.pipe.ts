import { Pipe, PipeTransform } from '@angular/core';

// Dans ce pipe, nous avons un objet propertyMap qui contient la correspondance entre les noms de
// propriétés et les libellés conviviaux pour chaque type de modèle (User et Hearth). Le pipe prend
// en entrée le nom de la propriété ainsi que le type de modèle, et il renvoie le libellé
// correspondant à partir de l'objet propertyMap.

@Pipe({
  name: 'propertyNameToLabel',
})
export class PropertyNameToLabelPipe implements PipeTransform {
  transform(propertyName: string, modelType: string): string {
    const propertyMap: { [key: string]: { [key: string]: string } } = {
      User: {
        username: "Nom d'utilisateur",
        email: 'Email',
        age: 'Âge',
        isActive: 'Est actif',
      },
      Hearth: {
        id: 'ID',
        name: 'Foyer',
        users: 'Utilisateurs',
      },
    };

    return propertyMap[modelType][propertyName] || propertyName;
  }
}

// Exemple d'utilisation
// <div *ngFor="let key of Object.keys(user)">
//   <label>{{ key | propertyNameToLabel:'User' }}</label>: {{ user[key] }}
// </div>
// -> "Nom : Paul"
// <div *ngFor="let key of Object.keys(hearth)">
//   <label>{{ key | propertyNameToLabel:'Hearth' }}</label>: {{ hearth[key] }}
// </div>
// -> "Foyer : Maison"
