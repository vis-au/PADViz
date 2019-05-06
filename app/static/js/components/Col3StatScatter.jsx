import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

import StatScatter from './charts/StatScatter';

class Col3StatScatter extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isLoading: false,
        initData: null
    }

    componentDidMount() {
        this.setState({isLoading: true});
        
        fetch("/json/stat?type=s6")
        .then(res => res.json())
        .then(data => this.setState({
            isLoading: false,
            initData: data
        }))
    }

    componentDidUpdate(prevProps) {
        if(this.props.update && this.props.update != prevProps.update) {
            this.setState({initData: JSON.parse(this.props.update) });
        }
    }

    render(){
        const {initData} = this.state;
        let { width, height } = this.props.size
        return(
            <div>
                { initData ?
                <StatScatter initData={initData} width="400" height="400" name="stat-col1" {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default sizeMe({ monitorHeight: true })(Col3StatScatter)