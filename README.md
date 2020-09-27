# MyStrictTen

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.4.

The strict flag was used to scaffold the app.

## Workflow

```txt
ng serve // `http://localhost:4200/`
ng generate component component-name
ng build // artifacts will be stored in the `dist/` directory
ng test // to execute the unit tests via [Karma](https://karma-runner.github.io).
ng e2e // run the end-to-end tests via [Protractor](http://www.protractortest.org/)
```

## About this project

The app was created as an Angular 10 project using the newly introduced strict flag with the following Angular CLI command:

```js
ng new my-strict-ten --strict
```

The strict flag does the following:

* Enables strict mode in TypeScript, as well as other strictness flags recommended by the TypeScript  team. Specifically, forceConsistentCasingInFileNames, noImplicitReturns, noFallthroughCasesInSwitch.
* Turns on strict Angular compiler flags strictTemplates and strictInjectionParameters
* Bundle size budgets have been reduced by ~75%
* Turns on no-any tslint rule to prevent declarations of type any
* Marks your application as side-effect free to enable more advanced tree-shaking

The functionality is an implementation of the example code shown in the [official guide to Ngrx effects](https://ngrx.io/guide/effects).  This project is a work in progress to see if it's possible on the docs alone to make that code run.  There doesn't seem to be a lot of articles that cover this, aside from say [Pluralsight courses](https://app.pluralsight.com/library/courses/rxjs-angular-reactive-development/table-of-contents) that go through it all for a price.

Lets see how it goes.

## Registering effects

There are three methods discussed for registering effects in the providers: [].  Here they are shown all together (note they are not used all together):

```js
EffectsModule.forRoot()
EffectsModule.forFeature()
MovieEffects,
  {
    provide: USER_PROVIDED_EFFECTS,
    multi: true,
    useValue: [MovieEffects],
  },
```

1. Registering root effects by adding the EffectsModule.forRoot() method with an array of your effects to your AppModule.

2. For feature modules, register your effects by adding the EffectsModule.forFeature() method in the imports array of your NgModule.

3. You can provide root-/feature-level effects with the provider USER_PROVIDED_EFFECTS.

We have a movies module, so starting off with method 1, we add the forRoot() provider in the movies.module.ts file.  We can see the actions '[Movies Page] Load Movies' and '[Movies API] Movies Loaded Success' happening in the Redux dev tools, but there is no payload of movies yet.

I think we should rely on passed metadata from an action creator's props method.  Since the effects code shown in the documentation doesn't cover how to set up the state, we can try and use the state documentation to do that.

Currently we have an app.state.ts file which import { MovieState } from '../movies/store/movie.reducer';

The [store documentation](https://ngrx.io/guide/store) goes through a counter example.

The counter example has the @NgModule importing StoreModule.forRoot({ count: counterReducer })].

We have this EffectsModule.forRoot([MovieEffects] in the imports.  Is that the way to go.

Should it be StoreModule or EffectsModule?  The docs say *register the global Store within your application using the StoreModule.forRoot() method with a map of key/value pairs that define your state in the app.module.ts file.  We have this currently in the app module:

```js
    StoreModule.forRoot(reducers, { metaReducers }),
```

Trying out a basic approach, this works to give us an application state of an empty array in the dev tools:

```js
StoreModule.forRoot({ applicationState: movieReducer }),
```

Since there are two StoreModule.forRoot functions, one in the movie.module, and one in the app.module, I'm not sure what's proper.

This is the one in the app.module:

```js
EffectsModule.forRoot([MovieEffects]),
```

Everything appears to be working now with these effects:

```js
on(
  loadMovies,
  (state): MovieState => ({
    ...state,
    movies: state.movies,
  })
),
on(loadMoviesSuccess, (state, action) => ({
  ...state,
  movies: action.payload,
}))
```

I can see the state in the dev tools with the array of movies there, but the template is blank.  It seems like there is a problem with the asyc pipe.  But since all the code is coming from the official docs, I'm not sure what's going on.

We have our actions, effects and reducers, we have registered all that twice, so the only other piece we haven't looked at is a selector.  Worth a shot.  Currently, we have this:

```js
movies$: Observable<Movie[]> = this.store.select((state) => state.movies);
```

Looks OK without really knowing what's wrong.  The state is there and we can see the movies attached to it in the dev tools.

Selectors are pure functions used for obtaining slices of store state.  The [docs page for selectors](https://ngrx.io/guide/store/selectors) is a big one.  They are all shown in index.ts files, but I think we should create a specific file for them.

The first example shows two states:

```js
export interface FeatureState {
  counter: number;
}
export interface AppState {
  feature: FeatureState;
}
```

This is starting to look familiar.  We have an app state called State and a MovieState.

This seems like the way to go:

```js
export const selectMovies = (state: State) => state.movies;
export const selectFeatureMovies = createSelector(
  selectMovies,
  (state: MovieState) => state.movies
);
```

Next we have to use the selector with props.  There is actually only one example of doing this on the page, but there is no implementation of the selector they are using which uses dot notation.

Trying this:

```js
movies$: Observable<Movie[]> = this.store.select(selectFeatureMovies);
```

Causes this fearsome TS error under the selector:

```txt
No overload matches this call.
  Overload 1 of 9, '(mapFn: (state: { movies: Movie[]; }) => Movie[]): Observable<Movie[]>', gave the following error.
    Argument of type 'MemoizedSelector<State, Movie[], DefaultProjectorFn<Movie[]>>' is not assignable to parameter of type '(state: { movies: Movie[]; }) => Movie[]'.
      Types of parameters 'state' and 'state' are incompatible.
        Type '{ movies: Movie[]; }' is not assignable to type 'State'.
```

Maybe this will work:

```js
export const MOVIES_FEATURE_KEY = 'movies';
export const selectMovies = createFeatureSelector<MovieState, MovieState>(
  MOVIES_FEATURE_KEY
);
```

And in the component:

```js
movies$: Observable<MovieState> = this.store.select(selectMovies);
```

But now there is a fearsome runtime error:

```js
Time: 4824ms
: Compiled successfully.
    ERROR in src/app/movies/movies-page/movies-page.component.html:1:5 - error TS2322: Type 'MovieState | null' is not assignable to type 'any[] | Iterable<any> | (Iterable<any> & any[]) | (any[] & Iterable<any>) | null | undefined'.
      Type 'MovieState' is not assignable to type 'any[] | Iterable<any> | (Iterable<any> & any[]) | (any[] & Iterable<any>) | null | undefined'.
        Type 'MovieState' is not assignable to type 'any[] & Iterable<any>'.
          Type 'MovieState' is missing the following properties from type 'any[]': length, pop, push, concat, and 26 more.
    1 <li *ngFor="let movie of movies$ | async">
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      src/app/movies/movies-page/movies-page.component.ts:10:16
        10   templateUrl: './movies-page.component.html',
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

This compiles and runs, but the result is the same blank screen but a full store in the dev tools:

```js
movies$: Observable<MovieState> = this.store.select(selectMovies);
```

I take it back, it doesn't run.  We get the same error.  I think the constructor store type needs to match what the observable is pulling out of the store.  Here is the shown movies observable and constructor:

```js
movies$: Observable<Movie[]> = this.store.select(state => state.movies);
constructor(private store: Store<{ movies: Movie[] }>) {}
```

When we try to use the selectMovies selector, there is a TS error on the movies$ observable:

```txt
Type 'Observable<MovieState>' is not assignable to type 'Observable<Movie[]>'.
  Type 'MovieState' is missing the following properties from type 'Movie[]': length, pop, push, concat, and 26 more.ts(2322)
```

So maybe the MovieState in the reducer is the problem?  Or maybe we need a feature selector after all.

Using selectFeatureMovies then moves the TS error to that which says:

```txt
No overload matches this call.
  Overload 1 of 9, '(mapFn: (state: { movies: Movie[]; }) => Movie[]): Observable<Movie[]>', gave the following error.
    Argument of type 'MemoizedSelector<AppState, Movie[], DefaultProjectorFn<Movie[]>>' is not assignable to parameter of type '(state: { movies: Movie[]; }) => Movie[]'.
      Types of parameters 'state' and 'state' are incompatible.
        Property 'feature' is missing in type '{ movies: Movie[]; }' but required in type 'AppState'.
...
```

I've seen that error before, as my day job involves NgRx.  I can be fixed by adding both states to the constructor.

So this compiles and runs, but again, blank screen despite the store showing the movies array in the dev tools.

```js
movies$: Observable<Movie[]> = this.store.select(selectFeatureMovies);
constructor(private store: Store<AppState & MovieState>) {}
```

Actually, it's staying 'applicationState', not 'state'.  That name is set in the app.module.  Change it to state and the name changes, but still the blank screen.

```js
StoreModule.forRoot({ state: movieReducer }),
```

### Props and the payload

Another point that needs explaining is why the need for a 'payload'.  In the action, we have this:

```js
export const loadMoviesSuccess = createAction(
  '[Movies API] Movies Loaded Success',
  props<{ payload: Movie[] }>()
);
```

And a reducer that looks like this:

```js
on(loadMoviesSuccess, (state, action) => ({
  ...state,
  movies: action.payload,
}))
```

And in the effect we see:

```js
this.moviesService.getAll().pipe(
  map((movies) =>
    loadMoviesSuccess({ payload: movies })
  ),
  catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))
)
```

If we replace payload with movies, there is no difference as far as I can see.  So what do the docs say about this?

In the effects docs, it is shown but not explained.

An how about props?  If you use React, you are more familiar which the concept of props.  In Angular they are used with @Input annotations.

In the selector docs, we see this:

*To select a piece of state based on data that isn't available in the store you can pass props to the selector function. These props gets passed through every selector and the projector function. To do so we must specify these props when we use the selector inside our component.*

In the action, we have props and a payload.  I'm still not sure why we need either of them.  Why do all this boilerplate setup and the try to find something that "isn't available in the store" as it says above?

The official [docs for actions](https://ngrx.io/guide/store/actions) say: *The props method is used to define any additional metadata needed for the handling of the action. Action creators provide a consistent, type-safe way to construct an action that is being dispatched.*

Given that definition, it is not clear to me why we would need props here.  What we want is the response to the API call.  We don't need meta data to make the call in this case.  If it was something like "Load Movies by ID", then yes, we would want the ID in the props.  The payload is what I understand to be a semantic way of saying the result of the action/effect.

One article puts it like this: Actions *have an optional 'payload' property (naming is up to you but the standard is to name it 'payload') for sending in data to the effect/reducer*

So yeah, that makes sense when sometimes I have seen response instead of payload.  It's just a JSON property name I guess.

### Getting back to work

After a while away from this project, it's hard to jump back into the work in progress.  NgRx and Redux in general doesn't make it easy to just see some code and get to work.  At least not for me.

So coming back to this after a brief session a few weeks ago trying to understand the naming of the props and payload in the actions, the current error when running the app is:

```txt
core.js:4196 ERROR TypeError: Cannot read property 'movies' of undefined
    at movie.selectors.ts:15
```

SO says: *set a default case condtion* and has some code for the reducer.  You think StackOverflow would spell check it's submissions.  But no.  Lucky I have that plugin for VSCode so I can see that condition is misspelt there.

Anyhow, in the code it shows:

```js
default : {
  return state;
}
```

But the code is old.  It shows the case switch where these days they use the on format.  The docs don't show a default block anymore.

If we change the movie.selector line with the error from this:

```js
(state: MovieState) => state.movies
```

to this:

```js
(movies: MovieState) => movies
```

Then the app runs.  We still get a blank screen, but the movies array is in the dev tools, which is what it was like last time.

So why the blank screen?  It's starting to come back now.  The pipe is working, but after the page is rendered.  I don't know, it's an observable that's not that observant.

I have a feeling this is due to trying to use an app state and a movie state.  The goal was to have the movies state and the counter state working together and creating effects that combine both of them for some more advanced learning.  The current error is here:

```bash
: Compiled successfully.
    ERROR in src/app/movies/movies-page/movies-page.component.ts:15:52 - error TS2769: No overload matches this call.
      Overload 1 of 9, '(mapFn: (state: MovieState) => Movie[]): Observable<Movie[]>', gave the following error.
        Argument of type 'MemoizedSelector<AppState, Movie[], DefaultProjectorFn<Movie[]>>' is not assignable to parameter of type '(state: MovieState) => Movie[]'.
          Types of parameters 'state' and 'state' are incompatible.
            Type 'MovieState' is not assignable to type 'AppState'.
              Types of property 'movies' are incompatible.
                Property 'movies' is missing in type 'Movie[]' but required in type 'MovieState'.
      Overload 2 of 9, '(key: "movies"): Observable<Movie[]>', gave the following error.
        Argument of type 'MemoizedSelector<AppState, Movie[], DefaultProjectorFn<Movie[]>>' is not assignable to parameter of type '"movies"'.
    15   movies$: Observable<Movie[]> = this.store.select(selectFeatureMovies);
                                                          ~~~~~~~~~~~~~~~~~~~
      src/app/movies/store/movie.reducer.ts:10:3
        10   movies: Movie[];
             ~~~~~~
        'movies' is declared here.
```

## Original Readme

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
