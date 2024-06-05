import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  of,
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

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer l'observable de la liste des avatars
  getAllAvatars(): Observable<Avatar[]> {
    if (!this.avatars$) {
      this.avatars$ = new BehaviorSubject<Avatar[]>([]);
      this.http
        .get<Avatar[]>(this.avatarsPath)
        .pipe(
          catchError((err) => {
            console.error('Error loading avatars:', err);
            return of([]); // retourne un tableau vide en cas d'erreur
          }),
          tap((avatars) => {
            this.avatars$!.next(avatars);
          })
        )
        .subscribe();
    }
    return this.avatars$.asObservable();
  }

  // Méthode pour récupérer le chemin d'un avatar par son nom
  getAvatarPathFromName(name: string): Observable<string> {
    return this.getAllAvatars().pipe(
      map((avatars) => {
        const avatar = avatars.find((a) => a.name === name);
        return avatar ? avatar.path : 'path_to_default_avatar';
      }),
      catchError((err) => {
        console.error(`Error while fetching avatar path: ${err}`);
        return of('path_to_error_avatar');
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
