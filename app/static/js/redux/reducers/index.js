import {
    SET_INDEXES,
    SET_CLICK_HM,
    SET_HOVER,
    SET_TIME,
    SET_FREEZE,

    SET_HM_IDX,
    SET_SELECTED
} from '../actions/actionTypes';

export const initialState = {
    hover: null,
    indexes: null,
    time: null,
    hmIdx: null,
    clickHm: null,
    isFreeze: false
};

export const rootReducer = (state = initialState, action) => {
    switch(action.type) {
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