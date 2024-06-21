import { createAction, props } from '@ngrx/store';
import { Hearth } from './../../models/hearth';

export const loadHearths = createAction(
  '[Hearth List] Load Hearths By User',
  props<{ userId: number }>()
);

export const loadHearthsSuccess = createAction(
  '[Hearth List] Load Hearths Success',
  props<{ hearths: Hearth[] }>()
);

// TODO: Cet objet pourra être utilisé dans un reducer ou un effet pour traiter l'échec de manière appropriée,
// comme afficher une notification d'erreur à l'utilisateur, ou marquer l'état comme "échec de chargement".
export const loadHearthsFailure = createAction(
  '[Hearth List] Load Hearths Failure',
  props<{ error: any }>()
);

export const addHearth = createAction(
  '[Hearth List] Add Hearth',
  props<{ hearth: Hearth }>()
);

export const updateHearth = createAction(
  '[Hearth List] Update Hearth',
  props<{ hearth: Hearth }>()
);

export const deleteHearth = createAction(
  '[Hearth List] Delete Hearth',
  props<{ hearthId: number }>()
);

export const updateHearthDetails = createAction(
  '[Hearth List] Update Hearth Details',
  props<{ hearthId: number; updates: Partial<Hearth> }>()
);
