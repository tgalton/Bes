export function Required(target: object, propertyKey: string) {
  // Déclaration d'une variable statique pour stocker la valeur de la propriété
  let propertyValue: any;

  // Définition d'un nouveau getter et setter statique pour la propriété
  Object.defineProperty(target.constructor, propertyKey, {
    get() {
      // Si la valeur de la propriété est indéfinie, une erreur est lancée
      if (propertyValue === undefined) {
        throw new Error(`Attribute ${propertyKey} is required`);
      }
      // Retourne la valeur de la propriété
      return propertyValue!;
    },
    set(value) {
      // Enregistre la valeur attribuée à la propriété
      propertyValue = value;
    },
    configurable: true,
  });
}
// Ce décorateur `Required` utilise `Object.defineProperty()` pour définir un nouveau getter et setter pour la propriété marquée.
// Voici ce que font les différentes parties du code :
// 1. `let propertyValue: any;` - Déclare une variable pour stocker la valeur de la propriété. Cette variable est initialisée à `undefined`.
// 2. `Object.defineProperty(target, propertyKey, {...})` - Définit un nouveau getter et setter pour la propriété dans l'objet `target`.
// Cela remplace le comportement par défaut de la propriété. Le `{...}` est un objet de configuration pour `Object.defineProperty()`.
// 3. `get() {...}` - Le getter récupère la valeur de la propriété. S'il n'y a pas de valeur attribuée à la propriété (`propertyValue`
//  est `undefined`), une erreur est lancée. Sinon, la valeur de la propriété est renvoyée. Le `!` après `propertyValue` indique à TypeScript
// que la valeur ne sera jamais `undefined`.
// 4. `set(value) {...}` - Le setter enregistre la valeur attribuée à la propriété dans la variable `propertyValue`.
// 5. `configurable: true` - Par défaut, cette propriété est configurée en tant que configurable, ce qui signifie qu'elle peut être modifiée
// ultérieurement à l'aide de `Object.defineProperty()`.

// En résumé, ce décorateur `Required` permet de marquer une propriété comme requis, de sorte qu'une erreur est lancée si la propriété est
// utilisée sans avoir une valeur attribuée au préalable. Cela permet de détecter les problèmes potentiels lors du développement de l'application.
