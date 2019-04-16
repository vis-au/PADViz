import {connect} from 'react-redux';

import OriSpaghetti from '../components/OriSpaghetti';

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes
})

export default connect(mapStateToProps)(OriSpaghetti);