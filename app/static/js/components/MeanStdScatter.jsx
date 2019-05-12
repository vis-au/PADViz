import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

import StatScatter from './charts/StatScatter';

class MeanStdScatter extends Component {
    
    constructor(props) {
        super(props)
    }
    state = {
        initData: null
    }

    componentDidMount() {
        fetch(this.props.initUrl)
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
        let { name } = this.props;

        return(
            <div>
                { initData ?
                <StatScatter initData={initData} width="400" height="400" name={name} {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default sizeMe({ monitorHeight: true })(MeanStdScatter)