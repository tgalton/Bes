import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Avatar } from '../models/avatar';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  constructor(private http: HttpClient) {}

  getAvatars(): Observable<Avatar[]> {
    return this.http
      .get<Avatar[]>('./../../assets/icons.json')
      .pipe(
        map((data: any[]) =>
          data.map((item) => new Avatar(item.name, item.path))
        )
      );
  }
}
