import {connect} from 'react-redux';

import OriStatScatter from '../components/OriStatScatter';
import { setHover, setSelected } from '../redux/actions/index'

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes,
    selectedIndexes: state.selectedIndexes
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setHover: (hover) => dispatch(setHover(hover)),
    ssetSelected: (indexes) => dispatch(setSelected(indexes))
})

export default connect(mapStateToProps, mapDispatchToProps)(OriStatScatter);

