import {
    SET_INDEXES,
    SET_HOVER,
    SET_TIME,
    SET_HM_IDX
} from '../actions/actionTypes';

export const initialState = {
    hover: null,
    indexes: null,
    time: null,
    hmIdx: null
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
        case SET_HM_IDX:
            return {
                ...state,
                hmIdx: action.idx
            }
        default:
            return state;
    }
}