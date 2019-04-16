import {connect} from 'react-redux';

import OriAmpScatter from '../components/OriAmpScatter';

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes,
    time: state.time,
})

export default connect(mapStateToProps)(OriAmpScatter);

