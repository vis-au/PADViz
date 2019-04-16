import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

import Scatter from './charts/Scatter';

class OriAmpScatter extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isLoading: false,
        initData: null
    }

    componentDidMount() {
        this.setState({isLoading: true});
        
        fetch("/json/amp")
        .then(res => res.json())
        .then(data => this.setState({
            isLoading: false,
            initData: data
        }))
    }

    render(){
        const {initData} = this.state;
        let { width, height } = this.props.size
        return(
            <div>
                { initData ?
                <Scatter initData={initData} width="400" height="400" chartType='amp' {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default sizeMe({ monitorHeight: true })(OriAmpScatter)