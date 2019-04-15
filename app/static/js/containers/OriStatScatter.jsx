import {connect} from 'react-redux';

import OriStatScatter from '../components/OriStatScatter';

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes
})

export default connect(mapStateToProps)(OriStatScatter);

