import {
    SET_INDEXES,
    SET_HOVER,
    SET_TIME
} from './actionTypes';


export const setIndexes = indexes => ({
    type: SET_INDEXES,
    indexes
})

export const setHover = hover => ({
    type: SET_HOVER,
    hover
})

export const setTime = (time) => ({
    type: SET_TIME,
    time
})