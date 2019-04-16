import {connect} from 'react-redux';

import OriStatScatter from '../components/OriStatScatter';

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    amp_indexes: state.indexes,
    t_range: state.t_range
})

export default connect(mapStateToProps)(OriStatScatter);

