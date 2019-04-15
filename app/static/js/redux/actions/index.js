import {
    SET_INDEXES,
    SET_HOVER,
    SET_AMP_SCATTER
} from './actionTypes';


export const setIndexes = indexes => ({
    type: SET_INDEXES,
    indexes
})

export const setHover = hover => ({
    type: SET_HOVER,
    hover
})

export const setAmpScatter = (amp_indexes, t_range) => ({
    type: SET_AMP_SCATTER,
    amp_indexes,
    t_range
})