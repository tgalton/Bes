import { Injectable } from '@angular/core';
import { Hearth } from '../models/hearth';

@Injectable({
  providedIn: 'root'
})
export class HearthService {
  private hearths: Hearth[] = [
    new Hearth(1, 'Maison', [1,2]),
    new Hearth(1, 'Coloc', [2,3]),
    new Hearth(1, 'Maison', [])
  ]

  constructor() { }
  addHearth(){}
  updateHearth(){}
  deleteHearth(){}
}
