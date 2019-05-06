import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

import AmpScatter from './charts/AmpScatter';

class S2AmpScatter extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isLoading: false,
        initData: null
    }

    componentDidMount() {
        this.setState({isLoading: true});
        
        fetch("/json/amp?type=s2")
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
                <AmpScatter initData={initData} width="400" height="400" name='amp-col2' {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default sizeMe({ monitorHeight: true })(S2AmpScatter)