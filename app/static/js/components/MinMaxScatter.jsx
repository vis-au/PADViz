import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

import AmpScatter from './charts/AmpScatter';

class MinMaxScatter extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        initData: null
    }

    componentDidMount() {
        this.setState({isLoading: true});
        
        fetch(this.props.initUrl)
        .then(res => res.json())
        .then(data => this.setState({
            initData: data
        }))
    }

    componentDidUpdate(prevProps) {
        if(this.props.update && this.props.update != prevProps.update) {
            this.setState({initData: JSON.parse(this.props.update) });
        }
    }

    render(){
        const { initData } = this.state;
        const { name } = this.props;

        return(
            <div>
                { initData ?
                <AmpScatter initData={initData} width="400" height="400" name={name} {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default sizeMe({ monitorHeight: true })(MinMaxScatter)