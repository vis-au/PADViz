import {
    GET_DATA,
    DATA_RECEIVED,
    GET_CLICK_POS,
    // SET_CLICK_POS
    GET_INITIAL_DATA,
    SET_POS
} from './actionTypes';

export const getData = () => ({
    type: GET_DATA
})

export const dataReceived = (json) => ({
    type: DATA_RECEIVED,
    json
})

export const getClickPos = (time, amp, count) => ({
    type: GET_CLICK_POS,
    time,
    amp,
    count
})

export const getInitialData = (data) => ({
    type: GET_INITIAL_DATA,
    data
})

export const setPos = pos => ({
    type: SET_POS,
    pos
})
