import {
    GET_DATA,
    DATA_RECEIVED,
    GET_CLICK_POS,
    SET_POS
} from '../actions/actionTypes';

export const initialState = {
    data: ['test', '1'],
    clickPos: {},   
    loading: false,
    pos: null
};

export const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_DATA:
            return {...state, loading: true};
        case DATA_RECEIVED:
            return {...state, data: action.json, loading: false};
        case GET_CLICK_POS:
            console.log(action.count)
            return [...state, {data:{}, clickPos: action.count, loading:action.amp}];
        case SET_POS:
            console.log("store.pos:  " + action.pos)
            return action.pos;
        default:
            return state;
    }
}