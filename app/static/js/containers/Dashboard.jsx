import {connect} from 'react-redux';

import Dashboard from '../components/Dashboard';
import {getClickPos} from '../redux/selectors/index'
import { getData } from '../redux/actions/index';

const mapStatetoProps = (state) => ({
    pos: state.pos
})

const mapDistpachToProps = (state) => ({
    getData: getData,
})

export default connect(mapStatetoProps, null)(Dashboard);