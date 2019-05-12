import {connect} from 'react-redux';

import Dashboard from '../components/Dashboard';
import { setFreeze } from '../redux/actions/index';

const mapStatetoProps = (state) => ({
    hover: state.hover,
    indexes: state.indexes,
    hmIdx: state.hmIdx,
    isFreeze: state.isFreeze
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setFreeze: (isFreeze) => dispatch(setFreeze(isFreeze))
})

export default connect(mapStatetoProps, mapDispatchToProps)(Dashboard);