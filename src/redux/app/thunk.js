// Load Actions
import { onSetFetching } from './actions';

export const setFetching = bool => dispatch => dispatch(onSetFetching(bool));
