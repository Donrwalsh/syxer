import { MetaReducer, ActionReducer } from '@ngrx/store';

export function rehydrateMetaReducer<State>(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state, action) {
    // On init, try to load saved state
    if (action.type === '@ngrx/store/init') {
      const savedState = localStorage.getItem('appState');
      if (savedState) {
        try {
          return JSON.parse(savedState) as State;
        } catch {
          console.warn('Failed to parse saved state');
        }
      }
    }

    // Run the normal reducer
    const nextState = reducer(state, action);

    // Persist the new state
    localStorage.setItem('appState', JSON.stringify(nextState));

    return nextState;
  };
}

export const metaReducers: MetaReducer[] = [rehydrateMetaReducer];