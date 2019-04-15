import {connect} from 'react-redux';

import Dashboard from '../components/Dashboard';
import {getClickPos} from '../redux/selectors/index'
import { getData } from '../redux/actions/index';

const mapStatetoProps = (state) => ({
    // clickPos: getClickPos(state)
    clickPos: state.clickPos,
    data: state.data,
    loading: state.loading,
    pos: state.pos
})

const mapDistpachToProps = (state) => ({
    getData: getData,
})

export default connect(mapStatetoProps, null)(Dashboard);