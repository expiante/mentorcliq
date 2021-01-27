// Load vendors
import { combineReducers } from 'redux';

// Load reducers
import { fetchingReducer } from './app/reducers';

// Combine reducers
const rootReducer = combineReducers({
  fetching: fetchingReducer,
});

// Export Root Reducer
export default rootReducer;
