import {
    SET_INDEXES,
    SET_CLICK_HM,
    SET_HOVER,
    SET_TIME,
    SET_FREEZE,

    SET_HM_IDX,
    SET_SELECTED,

    SET_HOVER_LINES,
    SET_LINE_MAX
} from './actionTypes';

export const setHoverLines = (indexes) => ({
    type: SET_HOVER_LINES,
    indexes
})

export const setLineMax = (max) => ({
    type: SET_LINE_MAX,
    max
})

export const setIndexes = (indexes) => ({
    type: SET_INDEXES,
    indexes
})

export const setClickHm = (name) => ({
    type: SET_CLICK_HM,
    name
})

export const setHover = hover => ({
    type: SET_HOVER,
    hover
})

export const setTime = (time) => ({
    type: SET_TIME,
    time
})

export const setFreeze = (isFreeze) => ({
    type: SET_FREEZE,
    isFreeze
})



export const setHMIdx = (idx) => ({
    type: SET_HM_IDX,
    idx
})

export const setSelected = indexes => ({
    type: SET_SELECTED,
    indexes
})