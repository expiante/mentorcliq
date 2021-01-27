// Load vendors
import { createReducer } from 'utils/reduxHelpers';

// Load types
import { ON_FETCHING } from './types';

// Reducer Handlers
const fetchingHandlers = {
  [ON_FETCHING]: (state, action) => action.payload,
};

// Initial States
const fetchingInitialState = false;

// Reducers
export const fetchingReducer = createReducer(fetchingInitialState, fetchingHandlers);
