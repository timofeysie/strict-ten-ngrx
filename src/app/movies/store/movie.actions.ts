import { createAction, props } from '@ngrx/store';
import { Movie } from '../movies-page/data/movie';

export const loadMovies = createAction(
  '[Movies Page] Load Movies'
);

export const loadMoviesSuccess = createAction(
  '[Movies API] Movies Loaded Success',
  props<{ payload: Movie[] }>()
);

export const loadMoviesError = createAction(
  '[Movies API] Movies Loaded Error'
);
