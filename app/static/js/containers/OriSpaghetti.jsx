import {connect} from 'react-redux';

import OriSpaghetti from '../components/OriSpaghetti';
import { setHover } from '../redux/actions/index'

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setHover: (hover) => dispatch(setHover(hover))
})

export default connect(mapStateToProps, mapDispatchToProps)(OriSpaghetti);