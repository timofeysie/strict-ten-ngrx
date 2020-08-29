import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from './data/movie';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.component.html',
  styleUrls: ['./movies-page.component.scss'],
})
export class MoviesPageComponent implements OnInit {
  movies$: Observable<Movie[]> = this.store.select((state) => state.movies);
  constructor(private store: Store<{ movies: Movie[] }>) {}

  ngOnInit(): void {
    // this.movieService.getAll().subscribe((movies) => (this.movies = movies));
    this.store.dispatch({ type: '[Movies Page] Load Movies' });
  }
}
