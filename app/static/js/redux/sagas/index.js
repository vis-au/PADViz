import {put, take, all} from 'redux-saga/effects';
import '@babel/polyfill';

import { getData, dataReceived } from '../actions'

function* fetchStatData() {
    const json = yield fetch('/json/stat_ori')
        .then(response => response.json(), );    
    yield put(getData);
}

function* actionWatcher() {
    yield take(dataReceived, fetchStatData)
}

export default function* rootSaga() {
    yield all([
        actionWatcher(),
    ]);
}