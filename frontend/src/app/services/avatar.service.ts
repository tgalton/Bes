import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  of,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { Avatar } from '../models/avatar';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private avatarsPath = './../../assets/icons.json';
  private hearthImagePath = './../../assets/hearth-images.json';
  private avatars$: BehaviorSubject<Avatar[]> | null = null;
  private hearthsImages$: BehaviorSubject<Avatar[]> | null = null;
  private isLoadingImages: boolean = true;
  private avatarPathCache = new Map<string, Observable<string>>();

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir le chemin d'un avatar par son nom.
  // Utilise la mise en cache pour éviter de recharger les chemins déjà obtenus.
  getAvatarPathFromName(name: string): Observable<string> {
    // Vérifie si le chemin a déjà été mis en cache
    if (!this.avatarPathCache.has(name)) {
      const avatarPath = this.getAllAvatars().pipe(
        map(
          (avatars) =>
            // Trouver l'avatar correspondant au nom donné dans la liste des avatars récupérés
            avatars.find((a) => a.name === name)?.path ||
            'assets/icons/defaultAvatar.png' // Retourne le chemin trouvé ou un chemin par défaut
        ),
        catchError((err) => {
          // En cas d'erreur lors de la requête HTTP, imprimer l'erreur et renvoyer un chemin standard d'erreur
          console.error('Error while fetching avatar path:', err);
          return of('path/to/error/avatar.jpg');
        }),
        shareReplay(1) // Utilisez shareReplay pour garder le dernier résultat en mémoire et éviter des appels multiples à la même requête
      );

      // Stockage du Observable dans le cache sous le nom de l'avatar
      this.avatarPathCache.set(name, avatarPath);
    }

    // Renvoie l'Observable depuis le cache
    return this.avatarPathCache.get(name)!;
  }

  // Méthode pour récupérer tous les avatars depuis le serveur
  getAllAvatars(): Observable<Avatar[]> {
    return this.http.get<Avatar[]>(this.avatarsPath).pipe(
      catchError((err) => {
        console.error('Failed to load avatars:', err);
        return of([]); // Renvoyer un tableau vide en cas d'erreur
      })
    );
  }

  getAllHearthImage(): Observable<Avatar[]> {
    if (!this.hearthsImages$) {
      this.hearthsImages$ = new BehaviorSubject<Avatar[]>([]);
      this.http
        .get<Avatar[]>(this.hearthImagePath)
        .pipe(
          tap((hearthsImages) => {
            console.log('Loaded hearths images:', hearthsImages);
            this.hearthsImages$!.next(hearthsImages);
            this.isLoadingImages = false; // Chargement terminé
          }),
          catchError((err) => {
            console.error('Error loading hearths images:', err);
            this.isLoadingImages = false;
            return of([]); // retourne un tableau vide en cas d'erreur
          })
        )
        .subscribe();
    }
    return this.hearthsImages$;
  }

  getHearthImageByName(name: string): Observable<string> {
    return this.getAllHearthImage().pipe(
      filter(() => !this.isLoadingImages), // Attendre que le chargement soit terminé
      map((hearthsImages) => {
        const hearthImage = hearthsImages.find((a) => a.name === name);
        if (!hearthImage) {
          throw new Error(`No hearth image with the name '${name}' found.`);
        }
        return hearthImage.path;
      }),
      catchError((err) => {
        console.error('Error in getHearthImageByName:', err);
        return throwError(() => err);
      })
    );
  }
}
