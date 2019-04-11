import {
    GET_DATA,
    DATA_RECEIVED,
    GET_CLICK_POS,
    GET_INITIAL_DATA
} from './actionTypes';

export const getData = () => ({
    type: GET_DATA
})

export const dataReceived = (json) => ({
    type: DATA_RECEIVED,
    json
})

export const getClickPos = (pos) => ({
    type: GET_CLICK_POS,
    pos
})

export const getInitialData = (data) => ({
    type: GET_INITIAL_DATA,
    data
})