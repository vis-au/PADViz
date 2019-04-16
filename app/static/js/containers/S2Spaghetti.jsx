import {connect} from 'react-redux';

import { setHover } from '../redux/actions/index'
import S2Spaghetti from '../components/S2Spaghetti';

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setHover: (hover) => dispatch(setHover(hover))
})

export default connect(mapStateToProps, mapDispatchToProps)(S2Spaghetti);