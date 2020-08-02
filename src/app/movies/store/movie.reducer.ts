import { createReducer, on } from '@ngrx/store';
import { loadMovies } from './movie.actions';

export const initialState = [];

const _movieReducer = createReducer(
  initialState,
  on(loadMovies, (state) => state)
);

export function movieReducer(state, action) {
         return _movieReducer(state, action);
       }
