import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

import HeatMap from './charts/HeatMap';

class OriHeatMap extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isLoading: false,
        initData: null,
        indexMap: null,
    }

    componentDidMount() {
        this.setState({isLoading: true});
        
        fetch("/json/heatmap")
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

    componentDidUpdate() {
        
    }

    render(){
        const {initData, indexMap} = this.state;
        let { width, height } = this.props.size
        return(
            <div>
                { initData ?
                <HeatMap initData={initData} indexMap={indexMap} type="origin" width={width} height={height ? height : (width/3.5)} {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default sizeMe({ monitorHeight: true })(OriHeatMap);