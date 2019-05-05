import {
    SET_INDEXES,
    SET_HOVER,
    SET_TIME,
    SET_HM_IDX,
    SET_SELECTED
} from './actionTypes';


export const setIndexes = (indexes, sender) => ({
    type: SET_INDEXES,
    indexes,
    sender
})

export const setHover = hover => ({
    type: SET_HOVER,
    hover
})

export const setTime = (time) => ({
    type: SET_TIME,
    time
})

export const setHMIdx = (idx) => ({
    type: SET_HM_IDX,
    idx
})

export const setSelected = indexes => ({
    type: SET_SELECTED,
    indexes
})