# MyStrictTen

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.4.

The strict flag was used to scaffold the app.

```js
ng new my-strict-ten --strict
```

The strict flag does the following:

* Enables strict mode in TypeScript, as well as other strictness flags recommended by the TypeScript  team. Specifically, forceConsistentCasingInFileNames, noImplicitReturns, noFallthroughCasesInSwitch.
* Turns on strict Angular compiler flags strictTemplates and strictInjectionParameters
* Bundle size budgets have been reduced by ~75%
* Turns on no-any tslint rule to prevent declarations of type any
* Marks your application as side-effect free to enable more advanced tree-shaking

The functionality is an implementation of the example code shown in the [official guide to Ngrx effects](https://ngrx.io/guide/effects).

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

1. Registering root effects
After you've written your Effects class, you must register it so the effects start running. To register root-level effects, add the EffectsModule.forRoot() method with an array of your effects to your AppModule.

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
