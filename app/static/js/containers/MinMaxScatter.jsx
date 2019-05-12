import {connect} from 'react-redux';

import MinMaxScatter from '../components/MinMaxScatter';
import { setHover, setFreeze } from '../redux/actions/index';

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes,
    time: state.time,
    isFreeze: state.isFreeze
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setHover: (hover) => dispatch(setHover(hover))
})

export default connect(mapStateToProps, mapDispatchToProps)(MinMaxScatter);
