import {
    SET_LINE_MAX,
    SET_GLOBAL_FITLER,
    SET_GLOBAL_HOVER,
    SET_DIFF_XY,
    SET_STAT_XY,
    SET_HM_CELL,
} from './actionTypes';


export const setLineMax = (max) => ({
    type: SET_LINE_MAX,
    max
})

export const setGlobalFilter = (indexes) => ({
    type: SET_GLOBAL_FITLER,
    indexes
})

export const setGlobalHover = (indexes) => ({
    type: SET_GLOBAL_HOVER,
    indexes
})

export const setDiffXY = (arr) => ({
    type: SET_DIFF_XY,
    arr
})

export const setStatXY = (arr) => ({
    type: SET_STAT_XY,
    arr
})

export const setHMCell = (i) => ({
    type: SET_HM_CELL,
    i
})

