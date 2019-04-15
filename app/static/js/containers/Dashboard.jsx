import {connect} from 'react-redux';

import Dashboard from '../components/Dashboard';

const mapStatetoProps = (state) => ({
    hover: state.hover,
    indexes: state.indexes
})

export default connect(mapStatetoProps)(Dashboard);