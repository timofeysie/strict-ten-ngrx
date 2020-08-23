import { createReducer, on, State } from '@ngrx/store';
import { loadMovies, loadMoviesSuccess } from './movie.actions';
import { Movie } from '../movies-page/data/movie';

export const initialState: MovieState = {
  movies: []
};

export interface MovieState {
  movies: Movie[];
}

const _movieReducer = createReducer<MovieState>(
  initialState,
  on(
    loadMovies,
    (state): MovieState => ({
      ...state,
      movies: state.movies,
    })
  ),
  on(loadMoviesSuccess, state => ({ ...state, payload: state.movies })
  )
);
// state => ({ ...state, away: state.away + 1 })),
export function movieReducer(state, action) {
         return _movieReducer(state, action);
       }
