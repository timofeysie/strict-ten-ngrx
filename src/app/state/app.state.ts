import { MovieState } from '../movies/store/movie.reducer';

export interface AppState {
  movies: MovieState;
}
