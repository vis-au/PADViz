import {
    SET_LINE_MAX,
    SET_GLOBAL_FITLER,
    SET_GLOBAL_HOVER,
    SET_DIFF_XY,
    SET_STAT_XY,
    SET_HM_CELL,
} from '../actions/actionTypes';

export const initialState = {
    lineMax: 0,
    global_indexes: null,
    global_hover: [],
    diffxy: [],
    statxy: [],
    hmcell: [],
};

export const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_LINE_MAX: 
            return {
                ...state,
                lineMax: action.max
            }
        case SET_GLOBAL_FITLER: 
            return {
                ...state,
                global_indexes: action.indexes
            }
        case SET_GLOBAL_HOVER:
            return {
                ...state,
                global_hover: action.indexes
            }
        case SET_DIFF_XY:
            return {
                ...state,
                diffxy: action.arr
            }
        case SET_STAT_XY:
            return {
                ...state,
                statxy: action.arr
            }
        case SET_HM_CELL:
            return {
                ...state,
                hmcell: action.i
            }
        default:
            return state;
    }
}