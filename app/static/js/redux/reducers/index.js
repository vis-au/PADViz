import {
    SET_INDEXES,
    SET_HOVER,
    SET_AMP_SCATTER
} from '../actions/actionTypes';

export const initialState = {
    hover: null,
    indexes: null,
    amp_indexes: null,
    t_range: null
};

export const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_INDEXES:
            return {
                ...state, 
                pos: action.indexes
            };
        case SET_HOVER:
            return {
                ...state, 
                pos: action.hover
            };
        case SET_AMP_SCATTER:
            return {
                ...state,
                amp_indexes: action.amp_indexes,
                t_range: action.t_range
            }
        default:
            return state;
    }
}