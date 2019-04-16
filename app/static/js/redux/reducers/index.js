import {
    SET_INDEXES,
    SET_HOVER,
    SET_TIME
} from '../actions/actionTypes';

export const initialState = {
    hover: null,
    indexes: null,
    time: null
};

export const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_INDEXES:
            return {
                ...state, 
                indexes: action.indexes
            };
        case SET_HOVER:
            return {
                ...state, 
                hover: action.hover
            };
        case SET_TIME:
            return {
                ...state,
                time: action.time
            }
        default:
            return state;
    }
}