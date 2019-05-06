import {connect} from 'react-redux';

import { setHover } from '../redux/actions/index'
import Col2Spaghetti from '../components/Col2Spaghetti';

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setHover: (hover) => dispatch(setHover(hover))
})

export default connect(mapStateToProps, mapDispatchToProps)(Col2Spaghetti);