import {
    SET_INDEXES,
    SET_CLICK_HM,
    SET_HOVER,
    SET_TIME,
    SET_FREEZE,

    SET_HM_IDX,
    SET_SELECTED,

    SET_HOVER_LINES,
    SET_LINE_MAX,
    SET_GLOBAL_FITLER,
    SET_GLOBAL_HOVER,
    SET_DIFF_XY,
    SET_STAT_XY,
} from '../actions/actionTypes';

export const initialState = {
    hover: null,
    indexes: null,
    time: null,
    hmIdx: null,
    clickHm: null,
    isFreeze: false,

    lineIndexes: null,
    lineMax: 0,
    global_indexes: null,
    global_hover: [],
    diffxy: [],
    statxy: [],
};

export const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_HOVER_LINES:
            return {
                ...state,
                lineIndexes: action.indexes
            }
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

        case SET_INDEXES:
            return {
                ...state, 
                indexes: action.indexes
            };
        case SET_CLICK_HM:
            return {
                ...state,
                clickHm: action.name
            }
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
        case SET_FREEZE:
            return {
                ...state,
                isFreeze: action.isFreeze
            }
        case SET_SELECTED:
            return {
                ...state,
                selectedIndexes: [...state.selectedIndexes, action.indexes]
            }
        default:
            return state;
    }
}