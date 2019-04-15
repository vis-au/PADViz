import {connect} from 'react-redux';

import OriStatScatter from '../components/OriStatScatter';

const mapStateToProps = (state, ownProps) => ({
    pos: state.pos
})

export default connect(mapStateToProps)(OriStatScatter);

