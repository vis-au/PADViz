import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

import Spaghetti from './charts/Spaghetti';

class S2Spaghetti extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isLoading: false,
        initData: null
    }

    componentDidMount() {
        this.setState({isLoading: true});
        
        fetch("/json/line?type=s2")
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
                <Spaghetti initData={initData} width={width} height={height ? height : (width/3.5)} {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default sizeMe({ monitorHeight: true })(S2Spaghetti);