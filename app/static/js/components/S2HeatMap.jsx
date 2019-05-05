import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

import HeatMap from './charts/HeatMap';

class S2HeatMap extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isLoading: false,
        initData: null
    }

    componentDidMount() {
        this.setState({isLoading: true});
        
        fetch("/json/heatmap?type=s2")
        .then(res => res.json())
        .then(data => {
            let indexMap = {};
            data.map(function(d, i) {
                d.instances.forEach(function(idx) {
                    if(idx in indexMap) indexMap[idx].push(i)
                    else indexMap[idx] = [i]
                })
            })
            this.setState({
                isLoading: false,
                initData: data,
                indexMap: indexMap
            })
        })
    }

    render(){
        const {initData, indexMap} = this.state;
        let { width, height } = this.props.size
        return(
            <div>
                { initData ?
                <HeatMap initData={initData} indexMap={indexMap} type="col1" width={width} height={height ? height : (width/3.5)} {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default sizeMe({ monitorHeight: true })(S2HeatMap);