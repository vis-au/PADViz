import {
    GET_DATA,
    DATA_RECEIVED,
    GET_CLICK_POS
} from '../actions/actionTypes';

export const initialState = {
    data: [],
    clickPos: [1],    
    loading: false
};

export const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_DATA:
            return {...state, loading: true};
        case DATA_RECEIVED:
            return {...state, data: action.json, loading: false};
        case GET_CLICK_POS:
            return {...state, clickPos: action.pos};
        default:
            return state;
    }
}